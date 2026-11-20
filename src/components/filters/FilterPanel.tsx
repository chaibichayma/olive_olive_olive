

import { useState } from "react";
import type { ReactNode, FormEvent } from "react";

import {
  Search,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import FilterActions from "./FilterActions";

// ==========================================
// TYPES
// ==========================================

export type FilterValues = Record<string, string>;

export interface FilterOption {
  label: string;
  value: string;
}

interface BaseFilterField {
  label: string;
  className?: string;
  icon?: LucideIcon;
}

export type FilterField =
  | (BaseFilterField & {
      type: "search";
      name: string;
      placeholder?: string;
    })
  | (BaseFilterField & {
      type: "select";
      name: string;
      placeholder: string;
      options: FilterOption[];
    })
  | (BaseFilterField & {
      type: "date";
      name: string;
      placeholder?: string;
    })
  | (BaseFilterField & {
      type: "dateRange";
      fromName: string;
      toName: string;
      fromPlaceholder?: string;
      toPlaceholder?: string;
    })
  | (BaseFilterField & {
      type: "custom";
      name: string;
      render: (
        value: string,
        onChange: (value: string) => void
      ) => ReactNode;
    });

interface FilterPanelProps {
  title: string;
  icon?: ReactNode;
  fields: FilterField[];
  initialValues?: FilterValues;
  showActions?: boolean;
  applyOnChange?: boolean;
  onApply: (values: FilterValues) => void;
  onReset?: () => void;
}

// ==========================================
// STYLES
// ==========================================

const inputClassName = `
  h-[39px] w-full min-w-0 rounded-lg
  border border-[#DDE3DF]
  bg-white px-3
  text-[15px] font-semibold text-[#46534B]
  outline-none transition-all duration-200
  placeholder:text-[#A0AAA3]
  hover:border-[#B7C9BD]
  focus:border-[#6D9B82]
  focus:ring-2 focus:ring-[#E8F1EB]
  dark:border-[#35463B]
  dark:bg-[#26372C]
  dark:text-[#E5EDE7]
  dark:placeholder:text-[#829287]
  dark:hover:border-[#6FA982]
  dark:focus:border-[#91C5A1]
  dark:focus:ring-[#2B4434]
`;

const labelClassName = `
  mb-1.5 block
  text-[15px] font-semibold
  text-[#38453D]
  dark:text-[#D4E0D7]
`;

// ==========================================
// INITIAL VALUES
// ==========================================

function getInitialValues(
  fields: FilterField[],
  initialValues: FilterValues = {}
): FilterValues {
  const values: FilterValues = {};

  fields.forEach((field) => {
    if (field.type === "dateRange") {
      values[field.fromName] =
        initialValues[field.fromName] ?? "";

      values[field.toName] =
        initialValues[field.toName] ?? "";
    } else {
      values[field.name] =
        initialValues[field.name] ?? "";
    }
  });

  return values;
}

// ==========================================
// FILTER PANEL
// ==========================================

export default function FilterPanel({
  title,
  icon,
  fields,
  initialValues,
  onApply,
  onReset,
  showActions = true,
  applyOnChange = false,
}: FilterPanelProps) {
  const [values, setValues] = useState<FilterValues>(() =>
    getInitialValues(fields, initialValues)
  );

  const handleChange = (name: string, value: string) => {
    const updatedValues = {
      ...values,
      [name]: value,
    };

    setValues(updatedValues);

    if (applyOnChange) {
      onApply(updatedValues);
    }
  };

  // Appliquer les filtres
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onApply(values);
  };

  // Réinitialiser les filtres
  const handleReset = () => {
    const resetValues = getInitialValues(fields);

    setValues(resetValues);
    onReset?.();
    onApply(resetValues);
  };

  // ==========================================
  // RENDU DES CHAMPS
  // ==========================================

  const renderField = (field: FilterField) => {
    const FieldIcon = field.icon;

    // CHAMP PERSONNALISÉ
    if (field.type === "custom") {
      return field.render(
        values[field.name] ?? "",
        (value) => handleChange(field.name, value)
      );
    }

    // RECHERCHE
    if (field.type === "search") {
      return (
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A948D] dark:text-[#A8B8AC]"
          />

          <input
            type="search"
            value={values[field.name] ?? ""}
            onChange={(e) =>
              handleChange(field.name, e.target.value)
            }
            placeholder={field.placeholder ?? "Rechercher..."}
            className={`${inputClassName} pl-9`}
          />
        </div>
      );
    }

    // LISTE DÉROULANTE CLASSIQUE
    if (field.type === "select") {
      return (
        <div className="relative">
          {FieldIcon && (
            <FieldIcon
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#718078] dark:text-[#A8B8AC]"
            />
          )}

          <select
            value={values[field.name] ?? ""}
            onChange={(e) =>
              handleChange(field.name, e.target.value)
            }
            className={`
              ${inputClassName}
              appearance-none pr-9
              ${FieldIcon ? "pl-10" : ""}
              ${values[field.name] ? "" : "text-[#8A948D] dark:text-[#A8B8AC]"}
            `}
          >
            <option value="">{field.placeholder}</option>

            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#46534B] dark:text-[#B8C7BC]"
          />
        </div>
      );
    }

    // DATE SIMPLE
    if (field.type === "date") {
      return (
        <div className="relative">
          <CalendarDays
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#718078] dark:text-[#A8B8AC]"
          />

          <input
            type="date"
            value={values[field.name] ?? ""}
            onChange={(e) =>
              handleChange(field.name, e.target.value)
            }
            aria-label={field.label}
            className={`${inputClassName} pl-9`}
          />
        </div>
      );
    }

    // PÉRIODE DE DATES
    if (field.type === "dateRange") {
      return (
        <div className="flex h-[39px] min-w-0 items-center gap-2 rounded-lg border border-[#DDE3DF] bg-white px-2 transition-colors focus-within:border-[#6D9B82] dark:border-[#35463B] dark:bg-[#26372C] dark:focus-within:border-[#91C5A1]">
          <CalendarDays
            size={15}
            className="shrink-0 text-[#718078] dark:text-[#A8B8AC]"
          />

          <input
            type="date"
            aria-label={field.fromPlaceholder ?? "Du"}
            value={values[field.fromName] ?? ""}
            onChange={(e) =>
              handleChange(field.fromName, e.target.value)
            }
            className="w-full min-w-0 bg-transparent text-[10px] text-[#46534B] outline-none dark:text-[#E5EDE7]"
          />

          <span className="shrink-0 text-[10px] text-[#8A948D] dark:text-[#A8B8AC]">
            –
          </span>

          <input
            type="date"
            aria-label={field.toPlaceholder ?? "Au"}
            value={values[field.toName] ?? ""}
            onChange={(e) =>
              handleChange(field.toName, e.target.value)
            }
            className="w-full min-w-0 bg-transparent text-[10px] text-[#46534B] outline-none dark:text-[#E5EDE7]"
          />
        </div>
      );
    }

    return null;
  };

  // ==========================================
  // AFFICHAGE
  // ==========================================

  return (
    <div className="overflow-visible rounded-xl border border-[#E9EDEB] bg-white shadow-sm transition-colors duration-200 dark:border-[#35463B] dark:bg-[#1C2921]">
      {/* HEADER */}
      <div className="flex min-h-[36px] items-center gap-2 rounded-t-xl bg-[#EDF5EF] px-4 py-2 dark:bg-[#26372C]">
        {icon && (
          <span className="flex shrink-0 items-center text-[#285640] dark:text-[#91C5A1]">
            {icon}
          </span>
        )}

        <h3 className="text-[15px] font-bold text-[#285640] dark:text-[#B9DEC4]">
          {title}
        </h3>
      </div>

      {/* FORMULAIRE */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-end gap-x-4 gap-y-3 rounded-b-xl px-4 py-3"
      >
        {fields.map((field) => (
          <div
            key={
              field.type === "dateRange"
                ? field.fromName
                : field.name
            }
            className={`min-w-[150px] flex-1 ${field.className ?? ""}`}
          >
            <label className={labelClassName}>
              {field.label}
            </label>

            {renderField(field)}
          </div>
        ))}

        {/* BOUTONS RÉUTILISABLES */}
        {showActions && <FilterActions onReset={handleReset} />}
      </form>
    </div>
  );
}
