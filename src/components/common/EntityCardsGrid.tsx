
import { useEffect, useMemo, useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(items.length / pageSize)
  );

  // Corriger la page courante si le nombre d'éléments diminue
  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  // Éléments de la page actuelle
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage, pageSize]);

  return (
    <div className="space-y-5">
      {/* Grille des cartes */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {currentItems.map((item, index) => (
            <div key={index}>
              {renderCard(item)}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-48 items-center justify-center
          rounded-xl border border-dashed border-[#DCE3D8] bg-white">
          <p className="text-sm text-[#89948C]">
            {emptyMessage}
          </p>
        </div>
      )}

      {/* Pagination réutilisable */}
      {items.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={items.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
