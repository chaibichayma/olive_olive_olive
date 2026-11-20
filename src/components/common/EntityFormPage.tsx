import { FormPageLayout, type FormSection, type FormValues } from "../forms";


interface EntityFormPageProps {
  mode: "create" | "edit";
  entityName: string;
  breadcrumb: string;
  sections: FormSection[];
  initialValues?: FormValues;
  loading?: boolean;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  createDescription?: string;
  editDescription?: string;
  formDescription?: string;
}

export default function EntityFormPage({
  mode,
  entityName,
  breadcrumb,
  sections,
  initialValues,
  loading = false,
  onSubmit,
  onCancel,
  createDescription,
  editDescription,
  formDescription,
}: EntityFormPageProps) {
  const title =
    mode === "create"
      ? `Ajouter ${entityName}`
      : `Modifier ${entityName}`;

  const description =
    formDescription ??
    (mode === "create" ? createDescription : editDescription);

  return (
    <FormPageLayout
      title={title}
      description={description}
      sections={sections}
      initialValues={initialValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}