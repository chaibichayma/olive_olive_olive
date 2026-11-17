
import type { ReactNode } from "react";

import EntityForm from "./EntityForm";
import type {
  FormValues,
  FormSection,
} from "./EntityForm";

import DateTimeSummary from "./DateTimeSummary";
import type { DateTimeItem } from "./DateTimeSummary";

interface FormPageLayoutProps {
  title: string;
  description?: string;
  icon?: ReactNode;

  sections: FormSection[];
  initialValues?: FormValues;

  dateValues?: DateTimeItem[];
  dateTitle?: string;

  submitLabel?: string;

  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

export default function FormPageLayout({
  title,
  description,
  icon,
  sections,
  initialValues,
  dateValues,
  dateTitle,
  submitLabel = "Enregistrer",
  onSubmit,
  onCancel,
}: FormPageLayoutProps) {
  return (
    <div className="space-y-5">

      {dateValues && dateValues.length > 0 && (
        <DateTimeSummary
          title={dateTitle}
          dates={dateValues}
        />
      )}

      <EntityForm
        title={title}
        description={description}
        icon={icon}
        sections={sections}
        initialValues={initialValues}
        submitLabel={submitLabel}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />

    </div>
  );
}
