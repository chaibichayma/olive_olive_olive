
import { useMemo, useState } from "react";

export type EntityFilters = Record<string, string>;

interface UseEntityFiltersOptions<T, F extends EntityFilters> {
  items: T[];
  initialFilters: F;
  predicate: (
    item: T,
    search: string,
    filters: F
  ) => boolean;
}

export function useEntityFilters<
  T,
  F extends EntityFilters
>({
  items,
  initialFilters,
  predicate,
}: UseEntityFiltersOptions<T, F>) {
  // Recherche
  const [search, setSearch] = useState("");

  // Filtres
  const [filters, setFilters] = useState<F>(initialFilters);

  // Résultats filtrés
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      predicate(item, search.trim().toLowerCase(), filters)
    );
  }, [items, search, filters, predicate]);

  // Modifier un filtre
  const handleFilterChange = (
    name: string,
    value: string
  ) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Réinitialiser la recherche et les filtres
  const resetFilters = () => {
    setSearch("");
    setFilters(initialFilters);
  };

  return {
    search,
    setSearch,
    filters,
    setFilters,
    filteredItems,
    handleFilterChange,
    resetFilters,
  };
}
