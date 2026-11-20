

import { CalendarDays } from "lucide-react";
import DateTimeDisplay from "../common/DateTimeDisplay";

export interface DateTimeItem {
  label: string;
  value?: string | null;
}

interface DateTimeSummaryProps {
  title?: string;
  dates: DateTimeItem[];
}

export default function DateTimeSummary({
  title = "Dates enregistrées",
  dates,
}: DateTimeSummaryProps) {
  if (!dates.length) return null;

  return (
    <div className="
      rounded-xl border border-[#E5EBE6] bg-white p-4
      transition-colors duration-200
      dark:border-[#35463B] dark:bg-[#1C2921]
    ">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays
          size={17}
          className="text-[#285640] dark:text-[#91C5A1]"
        />

        <h3 className="text-sm font-semibold text-[#38453D] dark:text-[#E5EDE7]">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dates.map((date, index) => (
          <div key={`${date.label}-${index}`}>
            <p className="mb-1 text-xs text-[#89958C] dark:text-[#A8B8AC]">
              {date.label}
            </p>

            <DateTimeDisplay
              value={date.value}
              showTime
            />
          </div>
        ))}
      </div>
    </div>
  );
}
