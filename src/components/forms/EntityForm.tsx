
import { useEffect, useState } from "react";
import type {
  FormEvent,
  ReactNode,
} from "react";

import FormActions from "./FormActions";
import FormHeader from "./FormHeader";
import FormSection from "./FormSection";

// ==========================================
// TYPES
// ==========================================

export type FormValues = Record<string, string>;

export interface FormOption {
  label: string;
  value: string;
}

export interface FormField {
  name: string;
  label: string;

  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "datetime-local"
    | "select"
    | "textarea"
    | "image";

  placeholder?: string;
  options?: FormOption[];

  required?: boolean;
  disabled?: boolean;

  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2 | 3 | 4;

  direction?: "ltr" | "rtl";
  accept?: string;
}

export interface FormSection {
  title: string;
  description?: string;
  icon?: ReactNode;
  columns?: 1 | 2 | 3;
  fields: FormField[];
}

// ==========================================
// PROPRIÉTÉS
// ==========================================

interface EntityFormProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  sections: FormSection[];
  initialValues?: FormValues;
  submitLabel?: string;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

// ==========================================
// FORMULAIRE GÉNÉRIQUE
// ==========================================

export default function EntityForm({
  title,
  description,
  icon,
  sections,
  initialValues = {},
  submitLabel = "Enregistrer",
  onSubmit,
  onCancel,
}: EntityFormProps) {

  const [values, setValues] = useState<FormValues>(initialValues);

  // ==========================================
  // SYNCHRONISER LES VALEURS
  // ==========================================

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  // ==========================================
  // MODIFIER UNE VALEUR
  // ==========================================

  const handleChange = (name: string, value: string) => {
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // SOUMETTRE LE FORMULAIRE
  // ==========================================

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  // ==========================================
  // AFFICHAGE
  // ==========================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* EN-TÊTE */}

      <FormHeader
        title={title}
        description={description}
        icon={icon}
      />

      {/* SECTIONS */}

      {sections.map((section, index) => (
        <FormSection
          key={`${section.title}-${index}`}
          section={section}
          values={values}
          onChange={handleChange}
        />
      ))}

      {/* ACTIONS */}

      <FormActions
        submitLabel={submitLabel}
        onCancel={onCancel}
      />
    </form>
  );
}
