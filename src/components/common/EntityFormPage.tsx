
import type {
  FieldValues,
  DefaultValues,
  SubmitHandler,
} from "react-hook-form";

import PageFormLayout from "./PageFormLayout";

import type { EntityField } from "../forms/EntityForm";

interface EntityFormPageProps<T extends FieldValues> {
  mode: "create" | "edit";
  entityName: string;
  breadcrumb: string;

  fields: EntityField<T>[];

  initialData?: DefaultValues<T>;
  loading?: boolean;

  onSubmit: SubmitHandler<T>;
  onCancel: () => void;

  createDescription?: string;
  editDescription?: string;
  formDescription?: string;
}

export default function EntityFormPage<T extends FieldValues>({
  mode,
  entityName,
  breadcrumb,
  fields,
  initialData,
  loading = false,
  onSubmit,
  onCancel,
  createDescription,
  editDescription,
  formDescription,
}: EntityFormPageProps<T>) {
  return (
    <PageFormLayout<T>
      mode={mode}
      entityName={entityName}
      breadcrumb={breadcrumb}
      fields={fields}
      initialData={initialData}
      loading={loading}
      onSubmit={onSubmit}
      onCancel={onCancel}
      createDescription={createDescription}
      editDescription={editDescription}
      formDescription={formDescription}
    />
  );
}
