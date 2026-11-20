
interface AccountSummaryItem {
  label: string;
  value: string | number;
}

interface AccountSummaryProps {
  title?: string;
  items: AccountSummaryItem[];
  badge?: string;
  className?: string;
}

export default function AccountSummary({
  title = "Résumé du compte",
  items,
  badge,
  className = "",
}: AccountSummaryProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 ${className}`}
    >
      <div className="min-w-0">
        <h3 className="text-[18px] font-semibold text-[#38453D] dark:text-[#E5EDE7]">
          {title}
        </h3>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-[15px] text-[#89958C] dark:text-[#A8B8AC]">
          {items.map((item, index) => (
            <span key={`${item.label}-${index}`}>
              {item.value}
              {index < items.length - 1 && (
                <span className="ml-2 text-[#89958C] dark:text-[#718A78]">
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {badge && (
        <span className="shrink-0 rounded-full bg-[#EDF5EF] px-3 py-1 text-[14px] font-semibold text-[#285640] dark:bg-[#2B4434] dark:text-[#B9DEC4]">
          {badge}
        </span>
      )}
    </div>
  );
}
