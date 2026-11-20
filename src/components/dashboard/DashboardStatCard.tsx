

import type { LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
}

export default function DashboardStatCard({
  title,
  value,
  icon: Icon,
}: DashboardStatCardProps) {
  return (
    <div className="flex min-w-0 items-center gap-4 rounded-xl border border-[#E5EBE6] bg-white p-4 transition-all duration-200 hover:shadow-sm dark:border-[#35463B] dark:bg-[#1C2921] dark:hover:bg-[#223128]">

      {/* ICON */}

      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#EDF5EF] dark:bg-[#2B4434]">
        <Icon
          size={27}
          strokeWidth={1.8}
          className="text-[#285640] dark:text-[#91C5A1]"
        />
      </div>

      {/* INFORMATION */}

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-[#66736A] dark:text-[#A8B8AC]">
          {title}
        </p>

        <p className="mt-1 text-2xl font-bold text-[#26352B] dark:text-[#F1F5F2]">
          {value}
        </p>
      </div>

    </div>
  );
}
