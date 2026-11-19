
import type { ReactNode } from "react";

export interface StatItem {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
}

interface StatsCardsProps {
  items: StatItem[];
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}

export default function StatsCards({
  items,
  columns = 5,
  className = "",
}: StatsCardsProps) {
  const columnStyles = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 xl:grid-cols-3",
    4: "sm:grid-cols-2 xl:grid-cols-4",
    5: "sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5",
  };

  return (
    <div
      className={`grid grid-cols-1 gap-3 ${columnStyles[columns]} ${className}`}
    >
      {items.map((item, index) => (
        <div
          key={`${item.title}-${index}`}
          className="rounded-xl border border-[#E5EBE6] bg-white p-4 transition-shadow hover:shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {/* TITLE */}
              <p className="text-[14px] font-semibold text-[#89958C]">
                {item.title}
              </p>

              {/* VALUE */}
              <p className="mt-2 text-[22px] font-semibold text-[#38453D]">
                {item.value}
              </p>

              {/* SUBTITLE */}
              {item.subtitle && (
                <p className="mt-3 text-[12px] font-semibold text-[#89958C]">
                  {item.subtitle}
                </p>
              )}
            </div>

            {/* ICON */}
            {item.icon && (
              <div className="mt-6 flex h-13 w-13 shrink-0 items-center justify-center rounded-lg bg-[#EDF5EF] text-[#47785B]">
                {item.icon}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
