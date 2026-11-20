
import { PieChart } from "lucide-react";

interface SeasonData {
  label: string;
  percentage: number;
  color: string;
}

interface ReceiptsBySeasonChartProps {
  total?: number;
  seasons?: SeasonData[];
}

const defaultSeasons: SeasonData[] = [
  { label: "Saison 2024", percentage: 42, color: "#286A3B" },
  { label: "Saison 2023", percentage: 28, color: "#59A94F" },
  { label: "Saison 2022", percentage: 18, color: "#A4D977" },
  { label: "Saison 2021", percentage: 12, color: "#DDF1D2" },
];

export default function ReceiptsBySeasonChart({
  total = 186,
  seasons = defaultSeasons,
}: ReceiptsBySeasonChartProps) {
  const radius = 76;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  const segments = seasons.map((season) => {
    const length = (season.percentage / 100) * circumference;

    const segment = {
      ...season,
      dashArray: `${length} ${circumference - length}`,
      dashOffset: -offset,
    };

    offset += length;
    return segment;
  });

  return (
    <div className="flex h-[300px] flex-col rounded-xl border border-[#E5EBE6] bg-white p-4 transition-colors duration-200 dark:border-[#35463B] dark:bg-[#1C2921]">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <PieChart size={21} className="shrink-0 text-[#39834D] dark:text-[#91C5A1]" />

        <h3 className="text-base font-semibold text-[#26382C] dark:text-[#E5EDE7]">
          Bons de réception par saison
        </h3>
      </div>

      {/* Donut and legend */}
      <div className="grid flex-1 grid-cols-[1.1fr_1fr] items-center gap-2">
        {/* Donut */}
        <div className="relative mx-auto aspect-square w-full max-w-[210px]">
          <svg
            viewBox="0 0 200 200"
            className="h-full w-full -rotate-90"
            role="img"
            aria-label="Répartition des bons de réception par saison"
          >
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#F0F4F0"
              className="dark:stroke-[#35463B]"
              strokeWidth="28"
            />

            {segments.map((segment) => (
              <circle
                key={segment.label}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="28"
                strokeDasharray={segment.dashArray}
                strokeDashoffset={segment.dashOffset}
              />
            ))}
          </svg>

          {/* Center value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tracking-tight text-[#26382C] dark:text-[#F1F5F2]">
              {total}
            </span>
            <span className="text-sm text-[#89958C] dark:text-[#A8B8AC]">
              Bons
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-4">
          {seasons.map((season) => (
            <div
              key={season.label}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-3.5 w-3.5 shrink-0 rounded-[4px]"
                  style={{ backgroundColor: season.color }}
                />

                <span className="whitespace-nowrap text-sm font-medium text-[#59665D] dark:text-[#B8C7BC]">
                  {season.label}
                </span>
              </div>

              <span className="shrink-0 text-sm font-semibold text-[#26382C] dark:text-[#E5EDE7]">
                {season.percentage} %
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
