
import type { ReactNode } from "react";
import { Search, RotateCcw, Download } from "lucide-react";
import { Button, Input, Select } from "../ui";
import type { SelectOption } from "../ui/Select";

export interface FilterConfig {
  name: string;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  filters?: FilterConfig[];
  filterValues?: Record<string, string>;
  onFilterChange?: (name: string, value: string) => void;

  onReset?: () => void;
  onExport?: () => void;

  showExport?: boolean;
  extraActions?: ReactNode;
  className?: string;
}

export default function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  filters = [],
  filterValues = {},
  onFilterChange,
  onReset,
  onExport,
  showExport = false,
  extraActions,
  className = "",
}: FilterBarProps) {
  return (
    <div
      className={`
        mb-4 flex flex-col gap-3 rounded-xl
        border border-[#E1E7DA] bg-white p-4
        shadow-sm
        transition-colors duration-200
        dark:border-[#35463B] dark:bg-[#1C2921]
        ${className}
      `}
    >
      {/* Recherche et filtres */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
        {/* Recherche */}
        <div className="w-full xl:max-w-xs">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            leftIcon={<Search size={17} />}
          />
        </div>

        {/* Filtres dynamiques */}
        {filters.map((filter) => (
          <div
            key={filter.name}
            className="w-full xl:max-w-[190px]"
          >
            <Select
              aria-label={filter.label || filter.name}
              placeholder={filter.placeholder || "Tous"}
              value={filterValues[filter.name] ?? ""}
              onChange={(event) =>
                onFilterChange?.(filter.name, event.target.value)
              }
              options={filter.options}
            />
          </div>
        ))}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 xl:ml-auto">
          {onReset && (
            <Button
              variant="outline"
              size="md"
              leftIcon={<RotateCcw size={15} />}
              onClick={onReset}
            >
              Réinitialiser
            </Button>
          )}

          {showExport && (
            <Button
              variant="secondary"
              size="md"
              leftIcon={<Download size={15} />}
              onClick={onExport}
            >
              Exporter
            </Button>
          )}

          {extraActions}
        </div>
      </div>
    </div>
  );
}
