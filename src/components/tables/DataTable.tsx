
import type { ReactNode } from "react";
import EmptyState from "../common/EmptyState";

// ==================================================
// TYPES
// ==================================================

export interface TableColumn<T> {
  key: string;
  title: string;
  render?: (row: T, index: number) => ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey: (row: T, index: number) => string | number;

  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;

  minWidth?: number | string;
  maxWidth?: number | string;

  onRowClick?: (row: T) => void;
  className?: string;
  showCount?: boolean;
}

const alignmentClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// ==================================================
// DATATABLE
// ==================================================

export default function DataTable<T>({
  columns,
  data,
  getRowKey,
  loading = false,
  emptyTitle = "Aucune donnée disponible",
  emptyDescription = "Aucun élément à afficher pour le moment.",
  minWidth = "600px",
  maxWidth = "100%",
  onRowClick,
  className = "",
  showCount = false,
}: DataTableProps<T>) {

  // Chargement
  if (loading) {
    return (
      <div className={`w-full space-y-2 p-3 ${className}`}>
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-8 w-full animate-pulse rounded-md bg-[#F1F4F2]"
          />
        ))}
      </div>
    );
  }

  // Aucun résultat
  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        compact
      />
    );
  }

  return (
    <div
      className={`w-full min-w-0 ${className}`}
      style={{ maxWidth }}
    >
      {/* CONTENEUR RESPONSIVE */}
      <div className="w-full overflow-x-auto overscroll-x-contain rounded-lg">

        <table
          className="w-full border-collapse text-left"
          style={{ minWidth }}
        >

          {/* EN-TÊTE */}
          <thead>
            <tr className="border-y border-[#E9EDEB] bg-[#F7F8F9]">

              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`
                    whitespace-nowrap
                    px-3 py-2
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.02em]
                    text-[#77837B]

                    sm:px-3 sm:py-2
                    sm:text-[10px]

                    ${alignmentClasses[column.align ?? "left"]}
                    ${column.headerClassName ?? ""}
                  `}
                >
                  {column.title}
                </th>
              ))}

            </tr>
          </thead>

          {/* LIGNES */}
          <tbody className="divide-y divide-[#E9EDEB]">

            {data.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                onClick={() => onRowClick?.(row)}
                className={`
                  bg-white
                  transition-colors
                  duration-150
                  hover:bg-[#FAFCFA]
                  ${onRowClick ? "cursor-pointer" : ""}
                `}
              >

                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`
                      px-3 py-2
                      text-[12px]
                      font-semibold
                      leading-normal
                      text-[#737F77]

                      sm:px-3 sm:py-2
                      sm:text-[13px]

                      ${alignmentClasses[column.align ?? "left"]}
                      ${column.className ?? ""}
                    `}
                  >
                    <div className="min-w-0">
                      {column.render
                        ? column.render(row, index)
                        : String(
                            (row as Record<string, unknown>)[column.key] ?? "—"
                          )}
                    </div>
                  </td>
                ))}

              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {/* NOMBRE DE RÉSULTATS */}
      {showCount && (
        <div className="border-t border-[#E9EDEB] px-3 py-2">
          <p className="text-[9px] text-[#929B96]">
            {data.length} élément{data.length > 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
