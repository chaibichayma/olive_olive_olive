

import { useState } from "react";
import {
  CalendarDays,
  Layers,
  ReceiptText,
} from "lucide-react";

import { Card, Badge } from "../../components/ui";
import { PageHeader } from "../../components/common";

import { saisonsData } from "./data/saison.data";
import type { Saison } from "./types/saison.types";

import AjouterModifierPage from "./AjouterModifierPage";
import type { FormValues } from "../../components/forms";

import Footer from "../../components/common/Footer";
import DateTimeDisplay from "../../components/common/DateTimeDisplay";
import DataTableSection from "../../components/tables/DataTableSection";
import Pagination from "../../components/tables/Pagination";
import type { TableColumn } from "../../components/tables";

import { FilterPanel } from "../../components/filters";
import type {
  FilterField,
  FilterValues,
} from "../../components/filters";

import EmptyState from "../../components/common/EmptyState";
import RowActions from "../../components/common/RowActions";

// ==========================================
// FILTRES DES SAISONS
// ==========================================

const saisonFilters: FilterField[] = [
  {
    type: "select",
    name: "year",
    label: "Année",
    placeholder: "Toutes les années",
    icon: CalendarDays,
    options: [
      ...new Set(saisonsData.map((saison) => saison.year)),
    ]
      .sort((a, b) => b - a)
      .map((year) => ({
        label: String(year),
        value: String(year),
      })),
  },
  {
    type: "date",
    name: "beginDate",
    label: "Date début",
  },
  {
    type: "date",
    name: "endDate",
    label: "Date fin",
  },
  {
    type: "select",
    name: "statusId",
    label: "Statut",
    placeholder: "Tous les statuts",
    icon: Layers,
    options: [
      { label: "En cours", value: "1" },
      { label: "Clôturée", value: "2" },
    ],
  },
];

// ==========================================
// STATUT DE LA SAISON
// ==========================================

function getStatusVariant(statusId: number) {
  switch (statusId) {
    case 1:
      return "success" as const;
    case 2:
      return "neutral" as const;
    default:
      return "neutral" as const;
  }
}

// ==========================================
// PAGE CONSULTATION DES SAISONS
// ==========================================

export default function SaisonsPage() {

  // ==========================================
  // ÉTATS
  // ==========================================

  const [saisons, setSaisons] =
    useState<Saison[]>(saisonsData);

  const [filteredSaisons, setFilteredSaisons] =
    useState<Saison[]>(saisonsData);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [selectedSaison, setSelectedSaison] =
    useState<Saison | null>(null);

  // ==========================================
  // OUVRIR LE FORMULAIRE D'AJOUT
  // ==========================================

  const handleAdd = () => {
    setSelectedSaison(null);
    setIsFormOpen(true);
  };

  // ==========================================
  // OUVRIR LE FORMULAIRE DE MODIFICATION
  // ==========================================

  const handleEdit = (saison: Saison) => {
    setSelectedSaison(saison);
    setIsFormOpen(true);
  };

  // ==========================================
  // FERMER LE FORMULAIRE
  // ==========================================

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedSaison(null);
  };

  // ==========================================
  // ENREGISTRER : AJOUT / MODIFICATION
  // ==========================================

  const handleSave = (values: FormValues) => {

    // Vérifier la cohérence des dates
    if (
      values.beginDate &&
      values.endDate &&
      values.endDate < values.beginDate
    ) {
      window.alert(
        "La date de fin doit être postérieure à la date de début."
      );
      return;
    }

    const saisonData: Saison = {
      id: selectedSaison
        ? selectedSaison.id
        : Math.max(0, ...saisons.map((item) => item.id)) + 1,

      beginDate: values.beginDate,
      endDate: values.endDate,
      statusId: Number(values.statusId),
      year: Number(values.year),
      priceKilo: Number(values.priceKilo),
      priceAchat: Number(values.priceAchat),
      priceVente: Number(values.priceVente),
      nbreCaisses: Number(values.nbreCaisses),
    };

    let updatedSaisons: Saison[];

    if (selectedSaison) {

      // MODIFICATION

      updatedSaisons = saisons.map((item) =>
        item.id === selectedSaison.id
          ? saisonData
          : item
      );

    } else {

      // AJOUT

      updatedSaisons = [
        ...saisons,
        saisonData,
      ];
    }

    setSaisons(updatedSaisons);
    setFilteredSaisons(updatedSaisons);

    handleCancel();
  };

  // ==========================================
  // SUPPRIMER UNE SAISON
  // ==========================================

  const handleDelete = (saison: Saison) => {

    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la saison "${saison.year}" ?`
    );

    if (!confirmed) return;

    const updatedSaisons = saisons.filter(
      (item) => item.id !== saison.id
    );

    setSaisons(updatedSaisons);

    setFilteredSaisons((previous) =>
      previous.filter((item) => item.id !== saison.id)
    );
  };

  // ==========================================
  // APPLIQUER LES FILTRES
  // ==========================================

  const handleFilter = (filters: FilterValues) => {

    const result = saisons.filter((saison) => {

      // Filtre par année
      const matchesYear =
        !filters.year ||
        saison.year === Number(filters.year);

      // Filtre par date début
      const matchesBeginDate =
        !filters.beginDate ||
        saison.beginDate >= filters.beginDate;

      // Filtre par date fin
      const matchesEndDate =
        !filters.endDate ||
        saison.endDate <= filters.endDate;

      // Filtre par statut
      const matchesStatus =
        !filters.statusId ||
        saison.statusId === Number(filters.statusId);

      return (
        matchesYear &&
        matchesBeginDate &&
        matchesEndDate &&
        matchesStatus
      );
    });

    setFilteredSaisons(result);
  };

  // ==========================================
  // RÉINITIALISER LES FILTRES
  // ==========================================

  const handleReset = () => {
    setFilteredSaisons(saisons);
  };

  // ==========================================
  // AFFICHAGE DU FORMULAIRE
  // ==========================================

  if (isFormOpen) {
    return (
      <div className="mx-auto w-full max-w-[1450px] space-y-4">

        <AjouterModifierPage
          saison={selectedSaison}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        <Footer />

      </div>
    );
  }

  // ==========================================
  // COLONNES DU TABLEAU DES SAISONS
  // ==========================================

  const saisonColumns: TableColumn<Saison>[] = [
    {
      key: "year",
      title: "Année",
      className: "whitespace-nowrap font-semibold text-[#38453D]",
    },
    {
      key: "beginDate",
      title: "Date début",
      className: "whitespace-nowrap",
      render: (row) => (
        <DateTimeDisplay value={row.beginDate} />
      ),
    },
    {
      key: "endDate",
      title: "Date fin",
      className: "whitespace-nowrap",
      render: (row) => (
        <DateTimeDisplay value={row.endDate} />
      ),
    },
    {
      key: "priceKilo",
      title: "Prix / Kg olives",
      align: "right",
      className: "whitespace-nowrap font-semibold text-[#46534B]",
      render: (row) => `${row.priceKilo.toFixed(3)} DT`,
    },
    {
      key: "priceAchat",
      title: "Prix achat / L",
      align: "right",
      className: "whitespace-nowrap",
      render: (row) => `${row.priceAchat.toFixed(3)} DT`,
    },
    {
      key: "priceVente",
      title: "Prix vente / L",
      align: "right",
      className: "whitespace-nowrap",
      render: (row) => `${row.priceVente.toFixed(3)} DT`,
    },
    {
      key: "nbreCaisses",
      title: "Nombre de caisses",
      align: "right",
      className: "whitespace-nowrap",
    },
    {
      key: "statusId",
      title: "Statut",
      render: (row) => (
        <Badge variant={getStatusVariant(row.statusId)}>
          {row.statusId === 1
            ? "En cours"
            : row.statusId === 2
              ? "Clôturée"
              : "Inconnu"}
        </Badge>
      ),
    },
    {
      key: "edit",
      title: "Modifier",
      render: (row) => (
        <RowActions
          type="edit"
          onClick={() => handleEdit(row)}
        />
      ),
    },
    {
      key: "delete",
      title: "Supprimer",
      render: (row) => (
        <RowActions
          type="delete"
          onClick={() => handleDelete(row)}
        />
      ),
    },
  ];

  // ==========================================
  // AFFICHAGE DE LA PAGE SAISONS
  // ==========================================

  return (
    <div className="mx-auto w-full max-w-[1450px] space-y-3 sm:space-y-4">

      {/* PAGE HEADER */}

      <PageHeader
        title="Liste des saisons"
        description="Consultez et gérez les différentes saisons."
        addLabel="Ajouter une saison"
        onAdd={handleAdd}
      />

      {/* FILTRES */}

      <FilterPanel
        title="Filtres - Saisons"
        icon={<CalendarDays size={18} />}
        fields={saisonFilters}
        onApply={handleFilter}
        onReset={handleReset}
      />

      {/* TABLEAU DES SAISONS */}

      <Card padding="md">

        <div className="mt-4">

          {filteredSaisons.length > 0 ? (
            <Pagination
              key={filteredSaisons.map((item) => item.id).join("-")}
              data={filteredSaisons}
              pageSize={7}
            >
              {(paginatedSaisons) => (
                <DataTableSection
                  title="Saisons"
                  badgeLabel={`${filteredSaisons.length} saisons`}
                  data={paginatedSaisons}
                  columns={saisonColumns}
                  getRowKey={(row) => row.id}
                  minWidth="1100px"
                />
              )}
            </Pagination>
          ) : (
            <EmptyState
              icon={<ReceiptText size={30} />}
              title="Aucune saison trouvée"
              description="Essayez de modifier vos critères de filtrage."
            />
          )}

        </div>

      </Card>

      {/* FOOTER */}

      <Footer />

    </div>
  );
}
