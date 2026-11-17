import { ArrowRight } from "lucide-react";

import { Badge } from "../ui";
import { DataTable, type TableColumn } from "../tables";
import type { Saison } from "../../pages/saisons/types/saison.types";


// Déterminer la couleur du badge selon le statut
function getStatusVariant(statusId: number) {
  switch (statusId) {
    case 1:
      return "success" as const; // En cours
    case 2:
      return "neutral" as const; // Clôturée
    default:
      return "neutral" as const;
  }
}

// Colonnes du tableau des saisons
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
  },
  {
    key: "endDate",
    title: "Date fin",
    className: "whitespace-nowrap",
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
    key: "action",
    title: "Accès",
    render: (row) => (
      <button
        type="button"
        onClick={() => console.log("Saison :", row.id)}
        className="inline-flex items-center gap-1 whitespace-nowrap text-[10px] font-semibold text-[#47785B] transition hover:text-[#285640] hover:underline"
      >
        Voir la fiche
        <ArrowRight size={12} />
      </button>
    ),
  },
];

interface SaisonTableProps {
  data: Saison[];
}

export default function SaisonTable({
  data,
}: SaisonTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E9EDEB]">
      <DataTable
        columns={saisonColumns}
        data={data}
        getRowKey={(row) => row.id}
        minWidth="1100px"
      />
    </div>
  );
}