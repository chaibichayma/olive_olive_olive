
import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps<T> {
  data: T[];
  pageSize?: number;
  children: (paginatedData: T[]) => ReactNode;
}

export default function Pagination<T>({
  data,
  pageSize = 7,
  children,
}: PaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(data.length / pageSize)
  );

  const startItem =
    data.length === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const endItem = Math.min(
    currentPage * pageSize,
    data.length
  );

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      {children(paginatedData)}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E9EDEB] px-1 py-3">

        {/* RÉSULTATS */}

        <p className="text-[12px] font-semibold text-[#8A948D]">
          {startItem}–{endItem} sur {data.length} résultats
        </p>

        {/* NAVIGATION */}

        <div className="flex items-center gap-2">

          {/* PRÉCÉDENT */}

          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
            className="
              inline-flex items-center gap-1
              text-[11px] font-semibold
              text-[#7A8A80]
              transition-colors
              hover:text-[#285640]
              disabled:cursor-not-allowed
            "
          >
            <ChevronLeft size={13} />
            Précédent
          </button>

          {/* PAGE ACTUELLE */}

          <span className="
            rounded-md
            bg-[#E8F1EB]
            px-2 py-1
            text-[11px] font-bold
            text-[#47785B]
          ">
            {currentPage}/{totalPages}
          </span>

          {/* SUIVANT */}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
            className="
              inline-flex items-center gap-1
              text-[11px] font-semibold
              text-[#285640]
              transition-colors
              hover:text-[#47785B]
              disabled:cursor-not-allowed
            "
          >
            Suivant
            <ChevronRight size={13} />
          </button>

        </div>
      </div>
    </div>
  );
}
