
import { Badge } from "../ui";
import { DataTable, type TableColumn } from "../tables";

interface DataTableSectionProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  getRowKey: (row: T) => string | number;
  title?: string;
  badgeLabel?: string;
  minWidth?: string;
}

export default function DataTableSection<T>({
  data,
  columns,
  getRowKey,
  title,
  badgeLabel,
  minWidth = "700px",
}: DataTableSectionProps<T>) {
  return (
    <div>
      {(title || badgeLabel) && (
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">

          {title && (
            <h3 className="
              text-[15px] font-semibold
              text-[#38453D]
              dark:text-[#E5EDE7]
            ">
              {title}
            </h3>
          )}

          {badgeLabel && (
            <Badge
              variant="success"
              className="text-[13px] font-semibold"
            >
              {badgeLabel}
            </Badge>
          )}

        </div>
      )}

      <div className="
        overflow-hidden rounded-lg
        border border-[#E9EDEB]
        dark:border-[#35463B]
        dark:bg-[#1C2921]
      ">
        <DataTable
          columns={columns}
          data={data}
          getRowKey={getRowKey}
          minWidth={minWidth}
        />
      </div>
    </div>
  );
}

