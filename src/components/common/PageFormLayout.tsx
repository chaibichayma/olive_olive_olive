
import type { FormValues, FormSection } from "../forms/EntityForm";

import PageHeader from "./PageHeader";
import EntityForm from "../forms/EntityForm";
import Footer from "./Footer";

interface PageFormLayoutProps {
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

export default function PageFormLayout({
  mode,
  entityName,
  breadcrumb,
  sections,
  initialValues,
  onSubmit,
  onCancel,
  createDescription,
  editDescription,
  formDescription,
}: PageFormLayoutProps) {
  const isEdit = mode === "edit";

  const pageTitle = isEdit
    ? `Modifier ${entityName}`
    : `Nouveau ${entityName}`;

  const pageDescription = isEdit
    ? editDescription ?? `Modifiez les informations de ${entityName}.`
    : createDescription ?? `Renseignez les informations de ${entityName}.`;

  const formTitle = `Informations de ${entityName}`;

  return (
    <div
      className="
        flex min-h-full flex-col space-y-4
        rounded-xl bg-[#F4F6F2] p-3
        transition-colors duration-200
        dark:bg-[#151F19]
        sm:p-4 lg:p-5
      "
    >
      {/* En-tête */}
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        breadcrumb={breadcrumb}
      />

      {/* Formulaire */}
      <EntityForm
        title={formTitle}
        description={
          formDescription ??
          "Renseignez les informations ci-dessous. Les champs marqués d'un astérisque sont obligatoires."
        }
        sections={sections}
        initialValues={initialValues}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />

      {/* Pied de page */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
