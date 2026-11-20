
import type { ReactNode } from "react";
import Pagination from "../tables/Pagination";

interface EntityCardsGridProps<T> {
  items: T[];
  renderCard: (item: T) => ReactNode;
  pageSize?: number;
  emptyMessage?: string;
}

export default function EntityCardsGrid<T>({
  items,
  renderCard,
  pageSize = 6,
  emptyMessage = "Aucun élément trouvé.",
}: EntityCardsGridProps<T>) {
  return (
    <div className="space-y-5">
      {/* Grille des cartes */}
      {items.length > 0 ? (
        <Pagination
          data={items}
          pageSize={pageSize}
        >
          {(currentItems) => (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {currentItems.map((item, index) => (
                <div key={index}>
                  {renderCard(item)}
                </div>
              ))}
            </div>
          )}
        </Pagination>
      ) : (
        /* État vide */
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-[#DCE3D8] bg-white transition-colors duration-200 dark:border-[#35463B] dark:bg-[#1C2921]">
          <p className="text-sm text-[#89948C] dark:text-[#A8B8AC]">
            {emptyMessage}
          </p>
        </div>
      )}
    </div>
  );
}
