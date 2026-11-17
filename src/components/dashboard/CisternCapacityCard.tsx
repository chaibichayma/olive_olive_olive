
import { Container } from "lucide-react";
import { Card } from "../ui";

interface CisternCapacityCardProps {
  totalCapacity?: number;
  currentVolume?: number;
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fr-FR").format(value);

export default function CisternCapacityCard({
  totalCapacity = 60000,
  currentVolume = 42500,
}: CisternCapacityCardProps) {
  const percentage =
    totalCapacity > 0
      ? Math.min((currentVolume / totalCapacity) * 100, 100)
      : 0;

  const availableVolume = Math.max(totalCapacity - currentVolume, 0);

  return (
    <Card padding="md">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <Container size={21} className="text-[#39834D]" />

          <h3 className="text-sm font-semibold text-[#26382C]">
            Capacité des citernes
          </h3>
        </div>

        {/* Capacity values */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-[#89958C]">
              Capacité totale
            </p>
            <p className="mt-1 text-2xl font-bold text-[#26382C]">
              {formatNumber(totalCapacity)} L
            </p>
          </div>

          <div className="border-l border-[#E5EBE6] pl-4">
            <p className="text-xs font-medium text-[#89958C]">
              Volume actuel
            </p>
            <p className="mt-1 text-2xl font-bold text-[#26382C]">
              {formatNumber(currentVolume)} L
            </p>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-[#66736A]">
              Taux de remplissage
            </span>

            <span className="text-sm font-bold text-[#285640]">
              {percentage.toFixed(0)}%
            </span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-[#E8EEE9]">
            <div
              className="h-full rounded-full bg-[#39834D] transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Available volume */}
        <div className="flex items-center justify-between border-t border-[#E5EBE6] pt-3">
          <span className="text-xs text-[#89958C]">
            Volume disponible
          </span>

          <span className="text-sm font-semibold text-[#39834D]">
            {formatNumber(availableVolume)} L
          </span>
        </div>
      </div>
    </Card>
  );
}
