
import { useState } from "react";
import { ChartNoAxesColumnIncreasing } from "lucide-react";

const data = {
  year: [
    { label: "Juil", value: 14 },
    { label: "Aoû", value: 20 },
    { label: "Sep", value: 25 },
    { label: "Oct", value: 28 },
    { label: "Nov", value: 31 },
    { label: "Déc", value: 40 },
  ],
  season: [
    { label: "Oct", value: 14 },
    { label: "Nov", value: 20 },
    { label: "Déc", value: 25 },
    { label: "Jan", value: 28 },
    { label: "Fév", value: 32 },
    { label: "Mar", value: 38 },
  ],
};

export default function ReceptionEvolutionChart() {
  const [period, setPeriod] = useState<"year" | "season">("year");

  const values = data[period];

  const width = 540;
  const height = 220;
  const left = 32;
  const right = 4;
  const top = 12;
  const bottom = 30;

  const plotHeight = height - top - bottom;
  const plotWidth = width - left - right;

  const points = values.map((item, index) => ({
    ...item,
    x: left + (index * plotWidth) / (values.length - 1),
    y: top + plotHeight - (item.value / 50) * plotHeight,
  }));

  const line = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const area = `${line} L ${points[points.length - 1].x} ${
    top + plotHeight
  } L ${points[0].x} ${top + plotHeight} Z`;

  return (
    <div className="flex h-[300px] flex-col rounded-xl border border-[#E5EBE6] bg-white p-4">
      {/* Header */}
      <div className="mb-2 flex shrink-0 items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ChartNoAxesColumnIncreasing
            size={21}
            className="shrink-0 text-[#39834D]"
          />

          <h3 className="text-sm font-semibold text-[#26382C]">
            Évolution des bons de réception
          </h3>
        </div>

        <select
          value={period}
          onChange={(event) =>
            setPeriod(event.target.value as "year" | "season")
          }
          className="rounded-lg border border-[#E5EBE6] bg-white px-3 py-2 text-xs text-[#45564A] outline-none focus:border-[#39834D]"
        >
          <option value="year">Cette année</option>
          <option value="season">Cette saison</option>
        </select>
      </div>

      {/* Chart */}
      <div className="min-h-0 flex-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="block h-full w-full"
          role="img"
          aria-label="Évolution des bons de réception"
        >
          <defs>
            <linearGradient
              id="chartArea"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#86C99A" stopOpacity=".45" />
              <stop offset="100%" stopColor="#86C99A" stopOpacity=".04" />
            </linearGradient>
          </defs>

          {/* Grid and Y labels */}
          {[0, 10, 20, 30, 40, 50].map((value) => {
            const y =
              top + plotHeight - (value / 50) * plotHeight;

            return (
              <g key={value}>
                <line
                  x1={left}
                  y1={y}
                  x2={width - right}
                  y2={y}
                  stroke="#E9EEEA"
                  strokeWidth="1"
                />

                <text
                  x={left - 9}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#7D8980"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Area */}
          <path d={area} fill="url(#chartArea)" />

          {/* Line */}
          <path
            d={line}
            fill="none"
            stroke="#39834D"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points and X labels */}
          {points.map((point) => (
            <g key={point.label}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="white"
                stroke="#39834D"
                strokeWidth="2.5"
              />

              <text
                x={point.x}
                y={height - 5}
                textAnchor="middle"
                fontSize="11"
                fill="#59665D"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
