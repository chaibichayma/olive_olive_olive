
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
    });

interface FilterPanelProps {
  title: string;
  icon?: ReactNode;
  fields: FilterField[];
  initialValues?: FilterValues;
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
  text-[11px] text-[#46534B]
  outline-none transition-all duration-200
  placeholder:text-[#A0AAA3]
  hover:border-[#B7C9BD]
  focus:border-[#6D9B82]
  focus:ring-2 focus:ring-[#E8F1EB]
`;

const labelClassName = `
  mb-1.5 block
  text-[11px] font-semibold
  text-[#38453D]
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
}: FilterPanelProps) {
  const [values, setValues] = useState<FilterValues>(() =>
    getInitialValues(fields, initialValues)
  );

  // Modifier une valeur
  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Appliquer les filtres
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onApply(values);
  };

  // Réinitialiser
  const handleReset = () => {
    const resetValues = getInitialValues(
      fields,
      initialValues
    );

    setValues(resetValues);
    onReset?.();
    onApply(resetValues);
  };

  // ==========================================
  // RENDU DES CHAMPS
  // ==========================================

  const renderField = (field: FilterField) => {
    const FieldIcon = field.icon;

    // RECHERCHE
    if (field.type === "search") {
      return (
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A948D]"
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

    // LISTE DÉROULANTE
    if (field.type === "select") {
      return (
        <div className="relative">
          {FieldIcon && (
            <FieldIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718078] pointer-events-none"
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
              ${values[field.name] ? "" : "text-[#8A948D]"}
            `}
          >
            <option value="">
              {field.placeholder}
            </option>

            {field.options.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#46534B]"
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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718078] pointer-events-none"
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
        <div className="flex h-[39px] min-w-0 items-center gap-2 rounded-lg border border-[#DDE3DF] bg-white px-2 transition-colors focus-within:border-[#6D9B82]">

          <CalendarDays
            size={15}
            className="shrink-0 text-[#718078]"
          />

          <input
            type="date"
            aria-label={field.fromPlaceholder ?? "Du"}
            value={values[field.fromName] ?? ""}
            onChange={(e) =>
              handleChange(field.fromName, e.target.value)
            }
            className="w-full min-w-0 bg-transparent text-[10px] text-[#46534B] outline-none"
          />

          <span className="shrink-0 text-[10px] text-[#8A948D]">
            –
          </span>

          <input
            type="date"
            aria-label={field.toPlaceholder ?? "Au"}
            value={values[field.toName] ?? ""}
            onChange={(e) =>
              handleChange(field.toName, e.target.value)
            }
            className="w-full min-w-0 bg-transparent text-[10px] text-[#46534B] outline-none"
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
    <div className="overflow-hidden rounded-xl border border-[#E9EDEB] bg-white shadow-sm">

      {/* HEADER */}

      <div className="flex min-h-[36px] items-center gap-2 bg-[#EDF5EF] px-4 py-2">

        {icon && (
          <span className="flex shrink-0 items-center text-[#285640]">
            {icon}
          </span>
        )}

        <h3 className="text-[12px] font-bold text-[#285640]">
          {title}
        </h3>

      </div>

      {/* FORMULAIRE */}

      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-end gap-x-4 gap-y-3 px-4 py-3"
      >

        {/* CHAMPS */}

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

        {/* ACTIONS RÉUTILISABLES */}

        <FilterActions onReset={handleReset} />

      </form>
    </div>
  );
}
