
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
    <div className="flex min-w-0 items-center gap-4 rounded-xl border border-[#E5EBE6] bg-white p-4 transition-shadow hover:shadow-sm">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#EDF5EF]">
        <Icon size={27} strokeWidth={1.8} className="text-[#285640]" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-[#66736A]">
          {title}
        </p>

        <p className="mt-1 text-2xl font-bold text-[#26352B]">
          {value}
        </p>
      </div>
    </div>
  );
}
