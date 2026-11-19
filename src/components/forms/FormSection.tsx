
import FormFieldRenderer from "./fields/FormFieldRenderer";

import type {
  FormSection as FormSectionData,
  FormValues,
} from "./EntityForm";

// ==========================================
// PROPRIÉTÉS
// ==========================================

interface FormSectionProps {
  section: FormSectionData;
  values: FormValues;
  onChange: (name: string, value: string) => void;
}

// ==========================================
// COMPOSANT SECTION
// ==========================================

export default function FormSection({
  section,
  values,
  onChange,
}: FormSectionProps) {

  const columns = section.columns ?? 2;

  // ==========================================
  // GRILLE RESPONSIVE
  // ==========================================

  const gridClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  // ==========================================
  // AFFICHAGE
  // ==========================================

  return (
    <section
      className="
        rounded-[10px]
        border border-[#E5EAE7]
        bg-white
        p-4
        shadow-[0_2px_10px_rgba(40,86,64,0.06)]
        sm:p-5
      "
    >
      {/* TITRE DE SECTION */}

      <div className="mb-4">
        <div className="flex items-center gap-2">

          <h3 className="text-[18px] font-semibold tracking-tight text-[#344238]">
            {section.title}
          </h3>
        </div>

        {section.description && (
          <p className="mt-1 text-[15px] font-semibold leading-5 text-[#7D8981]">
            {section.description}
          </p>
        )}
      </div>

      {/* GRILLE DES CHAMPS */}

      <div
        className={`
          grid
          ${gridClass}
          gap-x-3
          gap-y-3.5
          items-start
        `}
      >
        {section.fields.map((field) => {

          // Gestion largeur des champs
          const spanClass =
            field.colSpan === 3 && columns === 3
              ? "sm:col-span-2 lg:col-span-3"
              : field.colSpan === 2
                ? columns === 3
                  ? "sm:col-span-2 lg:col-span-2"
                  : columns === 2
                    ? "sm:col-span-2"
                    : ""
                : "";

          // Gestion hauteur des champs
          const rowSpanClass =
            field.rowSpan === 4
              ? "lg:row-span-4"
              : field.rowSpan === 3
                ? "lg:row-span-3"
                : field.rowSpan === 2
                  ? "lg:row-span-2"
                  : "";

          return (
            <div
              key={field.name}
              className={`
                min-w-0
                ${spanClass}
                ${rowSpanClass}
              `}
            >
              <FormFieldRenderer
                field={field}
                value={values[field.name] ?? ""}
                onChange={onChange}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
