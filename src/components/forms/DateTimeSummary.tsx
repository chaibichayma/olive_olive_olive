
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
    <div className="rounded-xl border border-[#E5EBE6] bg-white p-4">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays
          size={17}
          className="text-[#285640]"
        />

        <h3 className="text-sm font-semibold text-[#38453D]">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dates.map((date, index) => (
          <div key={`${date.label}-${index}`}>
            <p className="mb-1 text-xs text-[#89958C]">
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
