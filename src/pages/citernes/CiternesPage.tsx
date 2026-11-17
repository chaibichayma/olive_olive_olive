
import { useState } from "react";
import {
  Droplets,
  Layers,
  ReceiptText,
} from "lucide-react";

import { Card } from "../../components/ui";
import { PageHeader } from "../../components/common";

import { citernesData } from "./data/citerne.data";
import type { Citerne } from "./types/citerne.types";

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
// FILTRES DES CITERNES
// ==========================================

const capacities = [
  ...new Set(citernesData.map((citerne) => citerne.capacite)),
].sort((a, b) => a - b);

const citerneFilters: FilterField[] = [
  {
    type: "search",
    name: "reference",
    label: "Référence",
    placeholder: "Rechercher par référence...",
  },
  {
    type: "select",
    name: "capacite",
    label: "Capacité (L)",
    placeholder: "Toutes les capacités",
    icon: Layers,
    options: capacities.map((capacite) => ({
      label: `${capacite.toLocaleString("fr-FR")} L`,
      value: String(capacite),
    })),
  },
];

// ==========================================
// PAGE CONSULTATION DES CITERNES
// ==========================================

export default function CiternesPage() {

  // ==========================================
  // ÉTATS
  // ==========================================

  const [citernes, setCiternes] =
    useState<Citerne[]>(citernesData);

  const [filteredCiternes, setFilteredCiternes] =
    useState<Citerne[]>(citernesData);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [selectedCiterne, setSelectedCiterne] =
    useState<Citerne | null>(null);

  // ==========================================
  // OUVRIR LE FORMULAIRE D'AJOUT
  // ==========================================

  const handleAdd = () => {
    setSelectedCiterne(null);
    setIsFormOpen(true);
  };

  // ==========================================
  // OUVRIR LE FORMULAIRE DE MODIFICATION
  // ==========================================

  const handleEdit = (citerne: Citerne) => {
    setSelectedCiterne(citerne);
    setIsFormOpen(true);
  };

  // ==========================================
  // FERMER LE FORMULAIRE
  // ==========================================

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedCiterne(null);
  };

  // ==========================================
  // ENREGISTRER : AJOUT / MODIFICATION
  // ==========================================

  const handleSave = (values: FormValues) => {

    if (selectedCiterne) {

      // MODIFICATION

      const updatedCiterne: Citerne = {
        ...selectedCiterne,
        reference: values.reference.trim(),
        name: values.name.trim(),
        capacite: Number(values.capacite),
        dateFabrication: values.dateFabrication,
      };

      const updatedCiternes = citernes.map((citerne) =>
        citerne.id === selectedCiterne.id
          ? updatedCiterne
          : citerne
      );

      setCiternes(updatedCiternes);
      setFilteredCiternes((previous) =>
        previous.map((citerne) =>
          citerne.id === selectedCiterne.id
            ? updatedCiterne
            : citerne
        )
      );

    } else {

      // AJOUT

      const newCiterne: Citerne = {
        id:
          Math.max(0, ...citernes.map((citerne) => citerne.id)) + 1,
        reference: values.reference.trim(),
        name: values.name.trim(),
        capacite: Number(values.capacite),
        dateFabrication: values.dateFabrication,
      };

      setCiternes((previous) => [
        ...previous,
        newCiterne,
      ]);

      setFilteredCiternes((previous) => [
        ...previous,
        newCiterne,
      ]);
    }

    handleCancel();
  };

  // ==========================================
  // SUPPRIMER UNE CITERNE
  // ==========================================

  const handleDelete = (citerne: Citerne) => {

    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la citerne "${citerne.reference}" ?`
    );

    if (!confirmed) return;

    const updatedCiternes = citernes.filter(
      (item) => item.id !== citerne.id
    );

    setCiternes(updatedCiternes);

    setFilteredCiternes((previous) =>
      previous.filter((item) => item.id !== citerne.id)
    );
  };

  // ==========================================
  // APPLIQUER LES FILTRES
  // ==========================================

  const handleFilter = (filters: FilterValues) => {

    const result = citernes.filter((citerne) => {

      // Recherche par référence

      const matchesReference =
        !filters.reference ||
        citerne.reference
          .toLowerCase()
          .includes(filters.reference.toLowerCase());

      // Filtre par capacité

      const matchesCapacity =
        !filters.capacite ||
        citerne.capacite === Number(filters.capacite);

      return matchesReference && matchesCapacity;
    });

    setFilteredCiternes(result);
  };

  // ==========================================
  // RÉINITIALISER LES FILTRES
  // ==========================================

  const handleReset = () => {
    setFilteredCiternes(citernes);
  };

  // ==========================================
  // AFFICHAGE DU FORMULAIRE
  // ==========================================

  if (isFormOpen) {
    return (
      <div className="mx-auto w-full max-w-[1450px] space-y-4">

        <AjouterModifierPage
          citerne={selectedCiterne}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        <Footer />

      </div>
    );
  }

  // ==========================================
  // COLONNES DU TABLEAU
  // ==========================================

  const citerneColumns: TableColumn<Citerne>[] = [
    {
      key: "reference",
      title: "Référence",
      className: "whitespace-nowrap font-semibold text-[#38453D]",
    },
    {
      key: "name",
      title: "Nom de la citerne",
      className: "min-w-[170px]",
    },
    {
      key: "capacite",
      title: "Capacité",
      align: "right",
      className: "whitespace-nowrap font-semibold text-[#46534B]",
      render: (row) =>
        `${row.capacite.toLocaleString("fr-FR")} L`,
    },
    {
      key: "dateFabrication",
      title: "Date de fabrication",
      className: "whitespace-nowrap",
      render: (row) => (
        <DateTimeDisplay value={row.dateFabrication} />
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
  // AFFICHAGE DE LA PAGE CITERNES
  // ==========================================

  return (
    <div className="mx-auto w-full max-w-[1450px] space-y-3 sm:space-y-4">

      {/* PAGE HEADER */}

      <PageHeader
        title="Liste des citernes"
        description="Consultez et gérez les différentes citernes."
        addLabel="Ajouter une citerne"
        onAdd={handleAdd}
      />

      {/* FILTRES */}

      <FilterPanel
        title="Filtres - Citernes"
        icon={<Droplets size={18} />}
        fields={citerneFilters}
        onApply={handleFilter}
        onReset={handleReset}
      />

      {/* TABLEAU DES CITERNES */}

      <Card padding="md">

        <div className="mt-4">

          {filteredCiternes.length > 0 ? (

            <Pagination
              key={filteredCiternes
                .map((item) => item.id)
                .join("-")}
              data={filteredCiternes}
              pageSize={7}
            >
              {(paginatedCiternes) => (

                <DataTableSection
                  title="Citernes"
                  badgeLabel={`${filteredCiternes.length} citernes`}
                  data={paginatedCiternes}
                  columns={citerneColumns}
                  getRowKey={(row) => row.id}
                  minWidth="700px"
                />

              )}
            </Pagination>

          ) : (

            <EmptyState
              icon={<ReceiptText size={30} />}
              title="Aucune citerne trouvée"
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
