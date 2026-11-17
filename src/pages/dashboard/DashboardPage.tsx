
import {
  CalendarDays,
  Container,
  FileText,
  Users,
  Wallet,
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import DashboardStatCard from "../../components/dashboard/DashboardStatCard";
import ReceptionEvolutionChart from "../../components/dashboard/ReceptionEvolutionChart";
import ReceiptsBySeasonChart from "../../components/dashboard/ReceiptsBySeasonChart";
import RecentReceiptsTable from "../../components/dashboard/RecentReceiptsTable";
import CisternCapacityCard from "../../components/dashboard/CisternCapacityCard";

const dashboardStats = [
  {
    title: "Saisons",
    value: 5,
    icon: CalendarDays,
  },
  {
    title: "Citernes",
    value: 12,
    icon: Container,
  },
  {
    title: "Bons de réception",
    value: 186,
    icon: FileText,
  },
  {
    title: "Utilisateurs",
    value: 24,
    icon: Users,
  },
  {
    title: "Comptes",
    value: 3,
    icon: Wallet,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de votre activité"
      />

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {dashboardStats.map((stat) => (
          <DashboardStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Graphiques */}
      {/* Graphiques */}
<div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
  <div className="h-full xl:col-span-7">
    <ReceptionEvolutionChart />
  </div>

  <div className="h-full xl:col-span-5">
    <ReceiptsBySeasonChart />
  </div>
</div>
{/* Derniers bons et capacité des citernes */}
<div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
  <div className="min-w-0 xl:col-span-7">
    <RecentReceiptsTable/>
  </div>

  <div className="min-w-0 xl:col-span-5">
    <CisternCapacityCard />
  </div>
</div>
    </div>
  );
}
