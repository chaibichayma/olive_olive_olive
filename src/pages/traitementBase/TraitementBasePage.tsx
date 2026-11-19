
import { useState } from "react";
import {
  FlaskConical,
  Droplets,
  Weight,
  TrendingUp,
  Wallet,
  CircleDollarSign,
} from "lucide-react";

import { bonsReceptionData } from "./data/traitement.data";
import type { BonReception } from "./types/traitement.types";

import PageHeader from "../../components/common/PageHeader";

import FilterPanel, {
  type FilterField,
  type FilterValues,
} from "../../components/filters/FilterPanel";

import DataTableComboBox, {
  type ComboBoxColumn,
} from "../../components/common/DataTableComboBox";

import type { TableColumn } from "../../components/tables";

import { comptesData } from "../compte/data/compte.data";
import DataTableSection from "../../components/tables/DataTableSection";
import EmptyState from "../../components/common/EmptyState";
import AccountSummary from "../../components/common/AccountSummary";
import StatsCards from "../../components/common/StatsCards";
import Footer from "../../components/common/Footer";

// ==========================================
// TYPES
// ==========================================

type Compte = (typeof comptesData)[number];

// ==========================================
// COMBOBOX
// ==========================================

const compteColumns: ComboBoxColumn<Compte>[] = [
  {
    key: "name",
    title: "Nom du compte",
  },
  {
    key: "mobile",
    title: "Téléphone",
  },
];

// ==========================================
// FILTER CONFIGURATION
// ==========================================

const filterFields: FilterField[] = [
  {
    type: "custom",
    name: "compteId",
    label: "Compte",
    className: "w-full sm:w-[900px] sm:flex-none",
    render: (value, onChange) => (
      <DataTableComboBox<Compte>
        data={comptesData}
        columns={compteColumns}
        value={value}
        onChange={onChange}
        getOptionValue={(compte) => compte.id.toString()}
        getOptionLabel={(compte) =>
          `${compte.name} - ${compte.mobile}`
        }
        placeholder="Sélectionner un compte"
        maxHeight={260}
      />
    ),
  },
];

// ==========================================
// FORMATTERS
// ==========================================

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
  }).format(value);

const formatCurrency = (value: number) =>
  `${formatNumber(value)} DT`;

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR");

// ==========================================
// TABLE COLUMNS
// ==========================================

const bonColumns: TableColumn<BonReception>[] = [
  {
    key: "reference",
    title: "Référence",
    render: (row) => (
      <span className="font-semibold text-[#285640]">
        {row.reference}
      </span>
    ),
  },
  {
    key: "date",
    title: "Date",
    render: (row) => formatDate(row.date),
  },
  {
    key: "quantiteOlives",
    title: "Quantité olives",
    align: "right",
    render: (row) => `${formatNumber(row.quantiteOlives)} kg`,
  },
  {
    key: "quantiteHuile",
    title: "Quantité huile",
    align: "right",
    render: (row) => `${formatNumber(row.quantiteHuile)} L`,
  },
  {
    key: "rendement",
    title: "Rendement",
    align: "right",
    render: (row) => `${formatNumber(row.rendement)} %`,
  },
  {
    key: "montantTotal",
    title: "Montant total",
    align: "right",
    render: (row) => formatCurrency(row.montantTotal),
  },
  {
    key: "resteAPayer",
    title: "Reste à payer",
    align: "right",
    render: (row) => (
      <span
        className={
          row.resteAPayer > 0
            ? "font-semibold text-[14px] text-[#C17A36]"
            : "font-semibold text-[14px] text-[#47785B]"
        }
      >
        {formatCurrency(row.resteAPayer)}
      </span>
    ),
  },
  {
    key: "statut",
    title: "Statut",
    render: (row) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[13px] font-semibold ${
          row.statut === "Payé"
            ? "bg-[#EDF5EF] text-[#285640]"
            : row.statut === "En attente"
              ? "bg-[#FFF5E8] text-[#B77932]"
              : "bg-[#EEF2F8] text-[#55749A]"
        }`}
      >
        {row.statut}
      </span>
    ),
  },
];

// ==========================================
// PAGE
// ==========================================

export default function TraitementBasePage() {
  const [filters, setFilters] = useState<FilterValues>({
    compteId: "",
  });

  const [appliedCompteId, setAppliedCompteId] = useState("");

  // Appliquer les filtres
  const handleApplyFilters = (values: FilterValues) => {
    setFilters(values);
    setAppliedCompteId(values.compteId);
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setFilters({ compteId: "" });
    setAppliedCompteId("");
  };

  // Bons du compte sélectionné
  const bonsDuCompte = appliedCompteId
    ? bonsReceptionData.filter(
        (bon) => bon.compteId.toString() === appliedCompteId
      )
    : [];

  // Calcul des indicateurs
  const quantiteOlives = bonsDuCompte.reduce(
    (total, bon) => total + bon.quantiteOlives,
    0
  );

  const quantiteHuile = bonsDuCompte.reduce(
    (total, bon) => total + bon.quantiteHuile,
    0
  );

  const montantTotal = bonsDuCompte.reduce(
    (total, bon) => total + bon.montantTotal,
    0
  );

  const resteAPayer = bonsDuCompte.reduce(
    (total, bon) => total + bon.resteAPayer,
    0
  );

  const rendement =
    quantiteOlives > 0
      ? (quantiteHuile / quantiteOlives) * 100
      : 0;

  const selectedCompte = comptesData.find(
    (compte) => compte.id.toString() === appliedCompteId
  );

  return (
    <div className="space-y-5">

      {/* PAGE HEADER */}
      <PageHeader
        title="Traitement de base"
        description="Gestion et suivi des opérations de traitement des olives."
      />

      {/* FILTER PANEL */}
      <FilterPanel
  title="Filtres"
  icon={<FlaskConical size={16} />}
  fields={filterFields}
  initialValues={filters}
  onApply={handleApplyFilters}
  onReset={handleResetFilters}
  showActions={false}
  applyOnChange={true}
/>

      {/* RESULTS */}
      {appliedCompteId && (
        <div className="space-y-5">

          {/* SELECTED ACCOUNT */}
          {selectedCompte && (
            <AccountSummary
              title="Résumé du compte"
              items={[
                {
                  label: "Nom",
                  value: selectedCompte.name,
                },
                {
                  label: "Téléphone",
                  value: selectedCompte.mobile,
                },
              ]}
              badge={`${bonsDuCompte.length} bon(s)`}
            />
          )}

          {/* INDICATORS */}
          <StatsCards
            columns={5}
            items={[
              {
                title: "Quantité d'olives",
                value: `${formatNumber(quantiteOlives)} kg`,
                subtitle: "Total des olives réceptionnées",
                icon: <Weight size={21} />,
              },
              {
                title: "Quantité d'huile",
                value: `${formatNumber(quantiteHuile)} L`,
                subtitle: "Total d'huile produite",
                icon: <Droplets size={21} />,
              },
              {
                title: "Rendement",
                value: `${formatNumber(rendement)} %`,
                subtitle: "Huile / quantité d'olives",
                icon: <TrendingUp size={21} />,
              },
              {
                title: "Montant total",
                value: formatCurrency(montantTotal),
                subtitle: "Montant total de la production",
                icon: <CircleDollarSign size={21} />,
              },
              {
                title: "Reste à payer",
                value: formatCurrency(resteAPayer),
                subtitle: "Montant restant à régler",
                icon: <Wallet size={21} />,
              },
            ]}
          />

          {/* BON RECEPTION TABLE */}
          <div className="rounded-xl border border-[#E5EBE6] bg-white p-4 sm:p-5">
            <DataTableSection<BonReception>
              title="Liste des bons de réception"
              data={bonsDuCompte}
              columns={bonColumns}
              getRowKey={(row) => row.id}
              badgeLabel={`${bonsDuCompte.length} bon(s)`}
              minWidth="1100px"
            />

            {bonsDuCompte.length === 0 && (
              <EmptyState
                title="Aucun bon de réception"
                description="Aucun bon de réception trouvé pour ce compte."
                compact
              />
            )}
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!appliedCompteId && (
        <div className="rounded-xl border border-[#E5EBE6] bg-white">
          <EmptyState
            icon={<FlaskConical size={28} className="text-[#47785B]" />}
            title="Aucun compte sélectionné"
            description="Recherchez un compte par son nom ou son téléphone, puis sélectionnez-le pour afficher ses informations, ses indicateurs et ses bons de réception."
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
