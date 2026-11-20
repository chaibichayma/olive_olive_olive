
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
          className="
            rounded-xl border border-[#E5EBE6] bg-white p-4
            transition-colors duration-200 hover:shadow-sm
            dark:border-[#35463B] dark:bg-[#1C2921]
          "
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {/* TITLE */}
              <p className="text-[14px] font-semibold text-[#89958C] dark:text-[#A8B8AC]">
                {item.title}
              </p>

              {/* VALUE */}
              <p className="mt-2 text-[22px] font-semibold text-[#38453D] dark:text-[#E5EDE7]">
                {item.value}
              </p>

              {/* SUBTITLE */}
              {item.subtitle && (
                <p className="mt-3 text-[12px] font-semibold text-[#89958C] dark:text-[#A8B8AC]">
                  {item.subtitle}
                </p>
              )}
            </div>

            {/* ICON */}
            {item.icon && (
              <div className="
                mt-6 flex h-13 w-13 shrink-0 items-center justify-center
                rounded-lg bg-[#EDF5EF] text-[#47785B]
                transition-colors duration-200
                dark:bg-[#26372C] dark:text-[#91C5A1]
              ">
                {item.icon}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
