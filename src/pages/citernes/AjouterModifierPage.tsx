
import { useMemo } from "react";
import { Droplets } from "lucide-react";

import { FormPageLayout } from "../../components/forms";
import type {
  FormSection,
  FormValues,
} from "../../components/forms";

import type { Citerne } from "./types/citerne.types";

// ==========================================
// PROPRIÉTÉS
// ==========================================

interface AjouterModifierPageProps {
  citerne?: Citerne | null;
  onSave: (values: FormValues) => void;
  onCancel: () => void;
}

// ==========================================
// AJOUT / MODIFICATION D'UNE CITERNE
// ==========================================

export default function AjouterModifierPage({
  citerne,
  onSave,
  onCancel,
}: AjouterModifierPageProps) {

  // ==========================================
  // VALEURS INITIALES
  // ==========================================

  const initialValues = useMemo<FormValues>(
    () => ({
      reference: citerne?.reference ?? "",
      name: citerne?.name ?? "",
      capacite:
        citerne?.capacite != null
          ? String(citerne.capacite)
          : "",
      dateFabrication: citerne?.dateFabrication ?? "",
    }),
    [citerne]
  );

  // ==========================================
  // SECTION DU FORMULAIRE
  // ==========================================

  const sections: FormSection[] = [
    {
      title: "Informations de la citerne",
      description:
        "Renseignez les informations générales de la citerne.",
      icon: (
        <Droplets
          size={16}
          className="text-[#47785B]"
        />
      ),
      columns: 2,
      fields: [
        {
          name: "reference",
          label: "Référence",
          placeholder: "Ex. CIT-001",
          required: true,
        },
        {
          name: "name",
          label: "Nom de la citerne",
          placeholder: "Saisir le nom de la citerne",
          required: true,
        },
        {
          name: "capacite",
          label: "Capacité (L)",
          type: "number",
          placeholder: "Saisir la capacité en litres",
          required: true,
        },
        {
          name: "dateFabrication",
          label: "Date de fabrication",
          type: "date",
          required: true,
        },
      ],
    },
  ];

  // ==========================================
  // ENREGISTRER
  // ==========================================

  const handleSubmit = (values: FormValues) => {
    onSave(values);
  };

  // ==========================================
  // AFFICHAGE
  // ==========================================

  return (
    <FormPageLayout
      title={
        citerne
          ? "Modifier la citerne"
          : "Ajouter une citerne"
      }
      description={
        citerne
          ? "Modifiez les informations de la citerne."
          : "Remplissez le formulaire pour ajouter une nouvelle citerne."
      }
      icon={<Droplets size={20} />}
      sections={sections}
      initialValues={initialValues}
      submitLabel={
        citerne
          ? "Enregistrer les modifications"
          : "Ajouter la citerne"
      }
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
}
