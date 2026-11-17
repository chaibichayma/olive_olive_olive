import type { Saison } from "../../pages/saisons/types/saison.types";
import { Badge } from "../ui";
import SaisonTable from "./FinancingTable";


interface SaisonSectionProps {
  data: Saison[];
  title?: string;
  badgeLabel?: string;
}

export default function SaisonSection({
  data,
  title,
  badgeLabel,
}: SaisonSectionProps) {
  return (
    <div>
      {(title || badgeLabel) && (
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">

          {title && (
            <h3 className="text-[13px] font-semibold text-[#38453D]">
              {title}
            </h3>
          )}

          {badgeLabel && (
            <Badge variant="success">
              {badgeLabel}
            </Badge>
          )}

        </div>
      )}

      <SaisonTable data={data} />
    </div>
  );
}