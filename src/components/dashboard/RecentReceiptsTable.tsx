
import { FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Card, Button } from "../ui";
import DataTableSection from "../tables/DataTableSection";
import type { TableColumn } from "../tables";

interface Receipt {
  id: number;
  reference: string;
  name: string;
  mobile: string;
  quantityOil: number;
  price: number;
  statusLib: string;
  dateCreation: string;
}

const recentReceipts: Receipt[] = [
  {
    id: 1,
    reference: "BR-0186",
    name: "Ahmed Ben Ali",
    mobile: "22123456",
    quantityOil: 2500,
    price: 12500,
    statusLib: "Validé",
    dateCreation: "2024-12-12T10:30:00",
  },
  {
    id: 2,
    reference: "BR-0185",
    name: "Mohamed Trabelsi",
    mobile: "22345678",
    quantityOil: 1800,
    price: 9000,
    statusLib: "Validé",
    dateCreation: "2024-12-10T09:15:00",
  },
  {
    id: 3,
    reference: "BR-0184",
    name: "Sami Mansour",
    mobile: "22567890",
    quantityOil: 3000,
    price: 15000,
    statusLib: "En attente",
    dateCreation: "2024-12-08T11:45:00",
  },
];

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fr-FR").format(value);

const formatDate = (value: string) => {
  const date = new Date(value);

  if (isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const receiptColumns: TableColumn<Receipt>[] = [
  {
    key: "reference",
    title: "N° Bon",
  },
  {
    key: "name",
    title: "Nom",
  },
  {
    key: "mobile",
    title: "Téléphone",
  },
  {
    key: "quantityOil",
    title: "Quantité huile",
    render: (row) => `${formatNumber(row.quantityOil)} L`,
  },
  {
    key: "price",
    title: "Prix",
    render: (row) => `${formatNumber(row.price)} DT`,
  },
  {
    key: "statusLib",
    title: "Statut",
  },
  {
    key: "dateCreation",
    title: "Date création",
    render: (row) => formatDate(row.dateCreation),
  },
];

export default function RecentReceiptsTable() {
  const navigate = useNavigate();

  return (
    <Card padding="md">
      <div className="flex min-h-[220px] flex-col gap-4">

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <FileText
              size={21}
              className="shrink-0 text-[#39834D] dark:text-[#91C5A1]"
            />

            <h3 className="text-sm font-semibold text-[#26382C] dark:text-[#E5EDE7]">
              Derniers bons de réception
            </h3>
          </div>

          <Button
            variant="secondary"
            size="sm"
            rightIcon={<ArrowRight size={14} />}
            onClick={() => navigate("/bons-reception")}
          >
            Voir tout
          </Button>
        </div>

        {/* Table */}
        <div className="mt-3">
          <DataTableSection
            data={recentReceipts}
            columns={receiptColumns}
            getRowKey={(row) => row.id}
            minWidth="950px"
          />
        </div>

      </div>
    </Card>
  );
}
