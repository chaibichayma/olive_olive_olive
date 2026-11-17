
import type {
  FieldValues,
  DefaultValues,
  SubmitHandler,
} from "react-hook-form";

import { ArrowLeft } from "lucide-react";

import PageHeader from "./PageHeader";

import EntityForm, {
  type EntityField,
} from "../forms/EntityForm";
import Footer from "./Footer";

interface PageFormLayoutProps<T extends FieldValues> {
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

export default function PageFormLayout<T extends FieldValues>({
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
}: PageFormLayoutProps<T>) {
  const isEdit = mode === "edit";

  const pageTitle = isEdit
    ? `Modifier ${entityName}`
    : `Nouveau ${entityName}`;

  const pageDescription = isEdit
    ? editDescription ?? `Modifiez les informations de ${entityName}.`
    : createDescription ?? `Renseignez les informations de ${entityName}.`;

  const formTitle = isEdit
    ? `Informations de ${entityName}`
    : `Informations de ${entityName}`;

  return (
    <div className="min-h-full space-y-4 rounded-xl bg-[#F4F6F2] p-3 sm:p-4 lg:p-5">

      {/* En-tête */}

      <div className="flex flex-col gap-2">
        <PageHeader
          title={pageTitle}
          description={pageDescription}
          breadcrumb={breadcrumb}
        />

      </div>

      {/* Formulaire */}

      <EntityForm<T>
        mode={mode}
        fields={fields}
        initialData={initialData}
        title={formTitle}
        description={
          formDescription ??
          "Renseignez les informations ci-dessous. Les champs marqués d'un astérisque sont obligatoires."
        }
        loading={loading}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
      <div className="mt-auto">
      <Footer />
    </div>

    </div>
  );
}
