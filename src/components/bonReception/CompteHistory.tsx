
import { History } from "lucide-react";

import type { TableColumn } from "../../components/tables";
import DataTableSection from "../tables/DataTableSection";

// ==========================================
// TYPES
// ==========================================

interface HistoryItem {
  id: number;
  date: string;
  utilisateur: string;
  action: string;
  details: string;
  statut: "Validé" | "En Attente" | "Fin Prod" | "Non Payé";
}

// ==========================================
// DONNÉES STATIQUES
// ==========================================

const historyData: HistoryItem[] = [
  {
    id: 1,
    date: "15/11/2025 14:32",
    utilisateur: "Ayrah",
    action: "Création",
    details: "Création du bon de réception #25-R00008",
    statut: "Validé",
  },
  {
    id: 2,
    date: "15/11/2025 15:10",
    utilisateur: "Ayrah",
    action: "Modification",
    details: "Mise à jour de la quantité d'huile (60 → 65 L)",
    statut: "En Attente",
  },
  {
    id: 3,
    date: "16/11/2025 09:22",
    utilisateur: "Sami",
    action: "Validation",
    details: "Validation du bon de réception",
    statut: "Validé",
  },
  {
    id: 4,
    date: "17/11/2025 11:15",
    utilisateur: "Sami",
    action: "Paiement",
    details: "Enregistrement du paiement (156 DT)",
    statut: "Fin Prod",
  },
  {
    id: 5,
    date: "18/11/2025 16:40",
    utilisateur: "Ayrah",
    action: "Modification",
    details: "Ajout de l'observation",
    statut: "Non Payé",
  },
];

// ==========================================
// BADGE DU STATUT
// ==========================================

const getStatusBadge = (status: HistoryItem["statut"]) => {
  const styles = {
    "Validé": "bg-[#DDF5ED] text-[#15966C] dark:bg-[#174A38] dark:text-[#72D5AD]",
    "En Attente": "bg-[#F0E5FF] text-[#9854D8] dark:bg-[#402B56] dark:text-[#C9A2F0]",
    "Fin Prod": "bg-[#E3F5DF] text-[#4A9A48] dark:bg-[#294A30] dark:text-[#A3D69A]",
    "Non Payé": "bg-[#FFE5E8] text-[#E05260] dark:bg-[#542B32] dark:text-[#F29AA3]",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        min-w-[75px] rounded-full
        px-2 py-1
        text-[10px] font-semibold
        whitespace-nowrap
        ${styles[status]}
      `}
    >
      {status}
    </span>
  );
};

// ==========================================
// COLONNES DU TABLEAU
// ==========================================

const columns: TableColumn<HistoryItem>[] = [
  {
    key: "date",
    title: "Date",
  },
  {
    key: "utilisateur",
    title: "Utilisateur",
  },
  {
    key: "action",
    title: "Action",
  },
  {
    key: "details",
    title: "Détails",
    className: "min-w-[220px]",
  },
  {
    key: "statut",
    title: "Statut",
    render: (row) => getStatusBadge(row.statut),
  },
];

// ==========================================
// COMPOSANT HISTORIQUE DU COMPTE
// ==========================================

export default function CompteHistory() {
  return (
    <div className="rounded-xl border border-[#E5EBE6] bg-white p-4 transition-colors duration-200 dark:border-[#35463B] dark:bg-[#1C2921]">

      {/* HEADER */}
      <div className="mb-3 flex items-center gap-2">
        <History
          size={16}
          className="text-[#47785B] dark:text-[#91C5A1]"
        />

        <h3 className="text-sm font-semibold text-[#38453D] dark:text-[#E5EDE7]">
          Historique du compte
        </h3>
      </div>

      {/* TABLEAU */}
      <DataTableSection
        data={historyData}
        columns={columns}
        getRowKey={(row) => row.id}
        minWidth="750px"
      />

    </div>
  );
}
