
import { useState } from "react";
import {
  ReceiptText,
  UserRound,
  Leaf,
  CircleCheck,
} from "lucide-react";

import { Card } from "../../components/ui";
import { PageHeader } from "../../components/common";
import Footer from "../../components/common/Footer";
import DateTimeDisplay from "../../components/common/DateTimeDisplay";
import EmptyState from "../../components/common/EmptyState";
import RowActions from "../../components/common/RowActions";

import { bonReceptionData } from "./data/bonReception.data";
import type { BonReception } from "./types/bonReception.types";

import AjouterModifierPage from "./AjouterModifierPage";

import type { FormValues } from "../../components/forms/EntityForm";

import type { TableColumn } from "../../components/tables";
import DataTableSection from "../../components/tables/DataTableSection";
import Pagination from "../../components/tables/Pagination";

import { FilterPanel } from "../../components/filters";
import type {
  FilterField,
  FilterValues,
} from "../../components/filters";

// ==========================================
// CONVERSION DES DATES
// ==========================================

function getDateTimestamp(value: string): number | null {
  if (!value) return null;

  // Format dd/MM/yyyy HH:mm:ss
  const frenchDate = value.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}):(\d{2}))?$/
  );

  if (frenchDate) {
    const [
      ,
      day,
      month,
      year,
      hours = "00",
      minutes = "00",
      seconds = "00",
    ] = frenchDate;

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds)
    ).getTime();
  }

  // Format ISO
  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? null : timestamp;
}

// ==========================================
// PAGE CONSULTATION DES BONS DE RÉCEPTION
// ==========================================

export default function BonReceptionPage() {
  // ==========================================
  // ÉTATS
  // ==========================================

  const [bons, setBons] = useState<BonReception[]>(bonReceptionData);

  const [filteredBons, setFilteredBons] =
    useState<BonReception[]>(bonReceptionData);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [selectedBon, setSelectedBon] =
    useState<BonReception | null>(null);

  // ==========================================
  // OPTIONS DES FILTRES
  // ==========================================

  const compteOptions = [
    ...new Set(bons.map((bon) => String(bon.compteId))),
  ].map((id) => ({
    label: `Compte ${id}`,
    value: id,
  }));

  const natureOptions = [
    ...new Set(bons.map((bon) => String(bon.natureId))),
  ].map((id) => ({
    label: `Nature ${id}`,
    value: id,
  }));

  const statusOptions = Array.from(
    new Map(
      bons.map((bon) => [
        String(bon.statusId),
        {
          label: bon.statusLib,
          value: String(bon.statusId),
        },
      ])
    ).values()
  );

  const bonReceptionFilters: FilterField[] = [
    {
      type: "select",
      name: "compteId",
      label: "Compte",
      placeholder: "Tous les comptes",
      icon: UserRound,
      options: compteOptions,
    },
    {
      type: "select",
      name: "natureId",
      label: "Nature",
      placeholder: "Toutes les natures",
      icon: Leaf,
      options: natureOptions,
    },
    {
      type: "dateRange",
      fromName: "dateDebut",
      toName: "dateFin",
      label: "Période de création",
    },
    {
      type: "select",
      name: "statusId",
      label: "Statut",
      placeholder: "Tous les statuts",
      icon: CircleCheck,
      options: statusOptions,
    },
  ];

  // ==========================================
  // AJOUTER UN BON DE RÉCEPTION
  // ==========================================

  const handleAdd = () => {
    setSelectedBon(null);
    setIsFormOpen(true);
  };

  // ==========================================
  // MODIFIER UN BON DE RÉCEPTION
  // ==========================================

  const handleEdit = (bon: BonReception) => {
    setSelectedBon(bon);
    setIsFormOpen(true);
  };

  // ==========================================
  // ANNULER LE FORMULAIRE
  // ==========================================

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedBon(null);
  };

  // ==========================================
  // ENREGISTRER UN BON DE RÉCEPTION
  // ==========================================

  const handleSave = (values: FormValues) => {
    const bonId = selectedBon
      ? selectedBon.id
      : Math.max(0, ...bons.map((bon) => bon.id)) + 1;

    const newBon: BonReception = {
      id: bonId,

      reference: values.reference.trim(),
      compteId: Number(values.compteId),

      name: values.name.trim(),
      mobile: values.mobile.trim(),

      quantityOil: Number(values.quantityOil),
      quantityOlive: Number(values.quantityOlive),

      priceKg: Number(values.priceKg),
      price: Number(values.price),
      payement: Number(values.payement),
      acompte: Number(values.acompte),

      statusId: values.statusId,
      statusLib: values.statusLib.trim(),

      caisse: values.caisse.trim(),
      natureId: Number(values.natureId),

      priceOil: Number(values.priceOil),
      observation: values.observation.trim(),

      typeHuile: Number(values.typeHuile),
      isBaseCompte: values.isBaseCompte === "true",

      dateCreation: values.dateCreation,
      dateDebProduction: values.dateDebProduction,
      dateFinProduction: values.dateFinProduction,
    };

    let updatedBons: BonReception[];

    if (selectedBon) {
      // MODIFICATION
      updatedBons = bons.map((bon) =>
        bon.id === selectedBon.id ? newBon : bon
      );
    } else {
      // AJOUT
      updatedBons = [...bons, newBon];
    }

    setBons(updatedBons);
    setFilteredBons(updatedBons);

    setIsFormOpen(false);
    setSelectedBon(null);
  };

  // ==========================================
  // SUPPRIMER UN BON DE RÉCEPTION
  // ==========================================

  const handleDelete = (bon: BonReception) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le bon de réception ${bon.reference} ?`
    );

    if (!confirmed) return;

    const updatedBons = bons.filter(
      (item) => item.id !== bon.id
    );

    const updatedFilteredBons = filteredBons.filter(
      (item) => item.id !== bon.id
    );

    setBons(updatedBons);
    setFilteredBons(updatedFilteredBons);
  };

  // ==========================================
  // APPLIQUER LES FILTRES
  // ==========================================

  const handleFilter = (filters: FilterValues) => {
    const result = bons.filter((bon) => {

      // Filtre par référence
      const matchesReference =
        !filters.reference ||
        bon.reference
          .toLowerCase()
          .includes(filters.reference.toLowerCase());

      // Filtre par compte
      const matchesCompte =
        !filters.compteId ||
        String(bon.compteId) === filters.compteId;

      // Filtre par nature
      const matchesNature =
        !filters.natureId ||
        String(bon.natureId) === filters.natureId;

      // Filtre par statut
      const matchesStatus =
        !filters.statusId ||
        bon.statusId === filters.statusId;

      // Date de création
      const creationTimestamp = getDateTimestamp(
        bon.dateCreation
      );

      // Date de début
      const startTimestamp = filters.dateDebut
        ? new Date(
            `${filters.dateDebut}T00:00:00`
          ).getTime()
        : null;

      // Date de fin
      const endTimestamp = filters.dateFin
        ? new Date(
            `${filters.dateFin}T23:59:59.999`
          ).getTime()
        : null;

      const matchesStartDate =
        !startTimestamp ||
        (
          creationTimestamp !== null &&
          creationTimestamp >= startTimestamp
        );

      const matchesEndDate =
        !endTimestamp ||
        (
          creationTimestamp !== null &&
          creationTimestamp <= endTimestamp
        );

      return (
        matchesReference &&
        matchesCompte &&
        matchesNature &&
        matchesStatus &&
        matchesStartDate &&
        matchesEndDate
      );
    });

    setFilteredBons(result);
  };

  // ==========================================
  // RÉINITIALISER LES FILTRES
  // ==========================================

  const handleReset = () => {
    setFilteredBons(bons);
  };

  // ==========================================
  // COLONNES DU TABLEAU
  // ==========================================

  const bonReceptionColumns: TableColumn<BonReception>[] = [
    {
      key: "reference",
      title: "Référence",
      className: "whitespace-nowrap font-semibold text-[#38453D]",
    },
    {
      key: "name",
      title: "Nom",
      className: "min-w-[150px]",
    },
    {
      key: "mobile",
      title: "Téléphone",
      className: "whitespace-nowrap",
    },
    {
      key: "quantityOlive",
      title: "Quantité olives",
      align: "right",
      className: "whitespace-nowrap",
      render: (row) =>
        `${row.quantityOlive.toLocaleString("fr-FR")} Kg`,
    },
    {
      key: "quantityOil",
      title: "Quantité huile",
      align: "right",
      className: "whitespace-nowrap",
      render: (row) =>
        `${row.quantityOil.toLocaleString("fr-FR")} L`,
    },
    {
      key: "price",
      title: "Prix total",
      align: "right",
      className: "whitespace-nowrap font-semibold text-[#46534B]",
      render: (row) =>
        `${row.price.toLocaleString("fr-FR")} DT`,
    },
    {
      key: "payement",
      title: "Paiement",
      align: "right",
      className: "whitespace-nowrap",
      render: (row) =>
        `${row.payement.toLocaleString("fr-FR")} DT`,
    },
    {
      key: "statusLib",
      title: "Statut",
      render: (row) => (
        <span
          className={`
            inline-flex items-center rounded-full px-2.5 py-1
            text-[10px] font-semibold
            ${
              row.statusId === "1"
                ? "bg-[#EDF5EF] text-[#47785B]"
                : "bg-[#F1F3F2] text-[#68756C]"
            }
          `}
        >
          {row.statusLib}
        </span>
      ),
    },
    {
      key: "dateCreation",
      title: "Date de création",
      className: "whitespace-nowrap",
      render: (row) => (
        <DateTimeDisplay
          value={row.dateCreation}
          showTime
        />
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
  // AFFICHAGE DU FORMULAIRE
  // ==========================================

  if (isFormOpen) {
    return (
      <div className="mx-auto w-full max-w-[1450px] space-y-3 sm:space-y-4">

        <AjouterModifierPage
          bonReception={selectedBon}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        <Footer />

      </div>
    );
  }

  // ==========================================
  // AFFICHAGE DE LA PAGE
  // ==========================================

  return (
    <div className="mx-auto w-full max-w-[1450px] space-y-3 sm:space-y-4">

      {/* PAGE HEADER */}

      <PageHeader
        title="Liste des bons de réception"
        description="Consultez et gérez les bons de réception."
        addLabel="Ajouter un bon"
        onAdd={handleAdd}
      />

      {/* FILTRES */}

      <FilterPanel
        title="Filtres - Bons de réception"
        icon={<ReceiptText size={18} />}
        fields={bonReceptionFilters}
        onApply={handleFilter}
        onReset={handleReset}
      />

      {/* TABLEAU DES BONS DE RÉCEPTION */}

      <Card padding="md">

        <div className="mt-4">

          {filteredBons.length > 0 ? (

            <Pagination
              key={filteredBons.map((item) => item.id).join("-")}
              data={filteredBons}
              pageSize={7}
            >
              {(paginatedBons) => (
                <DataTableSection
                  title="Bons de réception"
                  badgeLabel={`${filteredBons.length} bons de réception`}
                  data={paginatedBons}
                  columns={bonReceptionColumns}
                  getRowKey={(row) => row.id}
                  minWidth="1250px"
                />
              )}
            </Pagination>

          ) : (

            <EmptyState
              icon={<ReceiptText size={30} />}
              title="Aucun bon de réception trouvé"
              description="Essayez de modifier vos critères de recherche."
            />

          )}

        </div>

      </Card>

      {/* FOOTER */}

      <Footer />

    </div>
  );
}
