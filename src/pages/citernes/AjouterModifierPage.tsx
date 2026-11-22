
import { useMemo, useState } from "react";
import { Droplets } from "lucide-react";

import { FormPageLayout } from "../../components/forms";
import type {
  FormSection,
  FormValues,
} from "../../components/forms";

import type { Citerne } from "./types/citerne.types";

import {
  saveCiterne,
  updateCiterne,
} from "../../services/citerneService";

import type { CiterneRequest } from "../../models/citerne.model";

interface AjouterModifierPageProps {
  citerne?: Citerne | null;
  onSave: (values: FormValues) => void | Promise<void>;
  onCancel: () => void;
}

export default function AjouterModifierPage({
  citerne,
  onSave,
  onCancel,
}: AjouterModifierPageProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // VALEURS INITIALES
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

  // SECTION DU FORMULAIRE
  const sections: FormSection[] = [
    {
      title: "Informations de la citerne",
      description:
        "Renseignez les informations générales de la citerne.",
      icon: (
        <Droplets size={16} className="text-[#47785B]" />
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

  // AJOUT / MODIFICATION
  const handleSubmit = async (values: FormValues) => {
    if (loading) return;

    try {
      setLoading(true);
      setErrorMessage("");

      const citerneData: CiterneRequest = {
        reference: String(values.reference).trim(),
        libelle: String(values.name).trim(),
        capacity: Number(values.capacite),
      };

      if (
        !citerneData.reference ||
        !citerneData.libelle ||
        !Number.isFinite(citerneData.capacity) ||
        citerneData.capacity <= 0
      ) {
        setErrorMessage(
          "Veuillez vérifier les informations saisies."
        );
        return;
      }

      if (citerne) {
        // UN SEUL APPEL UPDATE
        await updateCiterne({
          ...citerneData,
          id: citerne.id,
        });
      } else {
        // UN SEUL APPEL SAVE
        await saveCiterne(citerneData);
      }

      // Actualisation de la liste uniquement
      await onSave(values);

    } catch (error: any) {
      console.error("Erreur enregistrement citerne :", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      setErrorMessage(
        error.response?.data?.message ??
          "Une erreur est survenue lors de l'enregistrement."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

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
          loading
            ? "Enregistrement..."
            : citerne
              ? "Enregistrer les modifications"
              : "Ajouter la citerne"
        }
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}
