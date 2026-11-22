
import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";

import { FormPageLayout } from "../../components/forms";
import type {
  FormSection,
  FormValues,
} from "../../components/forms";

import type { Saison } from "./types/saison.types";

import {
  saveSaison,
  updateSaison,
} from "../../services/saisonService";

import type { SaisonRequest } from "../../models/saison.model";

// ==========================================
// PROPRIÉTÉS
// ==========================================

interface AjouterModifierPageProps {
  saison?: Saison | null;
  onSave: (values: FormValues) => void;
  onCancel: () => void;
}

// ==========================================
// AJOUT / MODIFICATION D'UNE SAISON
// ==========================================

export default function AjouterModifierPage({
  saison,
  onSave,
  onCancel,
}: AjouterModifierPageProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================
  // VALEURS INITIALES
  // ==========================================

  const initialValues = useMemo<FormValues>(
    () => ({
      beginDate: saison?.beginDate ?? "",
      endDate: saison?.endDate ?? "",
      statusId: String(saison?.statusId ?? 1),
      year: String(saison?.year ?? new Date().getFullYear()),
      priceKilo:
        saison?.priceKilo != null
          ? String(saison.priceKilo)
          : "",
      priceAchat:
        saison?.priceAchat != null
          ? String(saison.priceAchat)
          : "",
      priceVente:
        saison?.priceVente != null
          ? String(saison.priceVente)
          : "",
      nbreCaisses:
        saison?.nbreCaisses != null
          ? String(saison.nbreCaisses)
          : "",
    }),
    [saison]
  );

  // ==========================================
  // SECTION DU FORMULAIRE
  // ==========================================

  const sections: FormSection[] = [
    {
      title: "Informations de la saison",
      description:
        "Renseignez les dates et les paramètres de la saison oléicole.",
      icon: (
        <CalendarDays
          size={16}
          className="text-[#47785B]"
        />
      ),
      columns: 2,

      fields: [
        {
          name: "beginDate",
          label: "Date début saison",
          type: "date",
          required: true,
        },
        {
          name: "endDate",
          label: "Date fin saison",
          type: "date",
          required: true,
        },
        {
          name: "year",
          label: "Année de la saison",
          type: "number",
          placeholder: "Ex. 2026",
          required: true,
        },
        {
          name: "statusId",
          label: "Statut",
          type: "select",
          required: true,
          placeholder: "Sélectionner un statut",
          options: [
            {
              label: "En cours",
              value: "1",
            },
            {
              label: "Clôturée",
              value: "2",
            },
          ],
        },
        {
          name: "priceKilo",
          label: "Prix de production / Kg olives",
          type: "number",
          placeholder: "0.000",
          required: true,
        },
        {
          name: "priceAchat",
          label: "Prix d'achat / L huile",
          type: "number",
          placeholder: "0.000",
          required: true,
        },
        {
          name: "priceVente",
          label: "Prix de vente / L huile",
          type: "number",
          placeholder: "0.000",
          required: true,
        },
        {
          name: "nbreCaisses",
          label: "Nombre de caisses",
          type: "number",
          placeholder: "Saisir le nombre de caisses",
          required: true,
        },
      ],
    },
  ];

  // ==========================================
  // ENREGISTRER : AJOUT OU MODIFICATION
  // ==========================================

  
const handleSubmit = async (values: FormValues) => {
  try {
    setLoading(true);
    setErrorMessage("");

    const isEditing = saison?.id != null;

    // Vérifier l'identifiant en mode modification
    let saisonId: number | undefined;

    if (isEditing) {
      saisonId = Number(saison.id);

      if (!Number.isInteger(saisonId) || saisonId <= 0) {
        throw new Error("Identifiant de saison invalide.");
      }
    }

    // Préparer les données pour le backend
    const saisonData: SaisonRequest = {
      searche: String(values.searche ?? ""),
      beginDate: String(values.beginDate ?? ""),
      endDate: String(values.endDate ?? ""),
      statusId: Number(values.statusId),
      year: Number(values.year),
      priceKilo: Number(values.priceKilo),
      priceAchat: Number(values.priceAchat),
      priceVente: Number(values.priceVente),
      nbreCaisses: Number(values.nbreCaisses),

      ...(isEditing && {
        id: saisonId,
      }),
    };

    console.log("Données envoyées au backend :", saisonData);

    if (isEditing) {
      // Modification
      await updateSaison(saisonData);
      console.log("Saison modifiée avec succès");
    } else {
      // Création
      await saveSaison(saisonData);
      console.log("Saison créée avec succès");
    }

    // Actualiser la liste dans le composant parent
    onSave(values);

  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement de la saison :",
      error
    );

    setErrorMessage(
      "Une erreur est survenue lors de l'enregistrement de la saison. Veuillez réessayer."
    );
  } finally {
    setLoading(false);
  }
};


  // ==========================================
  // AFFICHAGE
  // ==========================================

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      {loading && (
        <p className="text-sm text-[#47785B] dark:text-[#91C5A1]">
          Enregistrement en cours...
        </p>
      )}

      <FormPageLayout
        title={
          saison
            ? "Modifier la saison"
            : "Ajouter une saison"
        }
        description={
          saison
            ? "Modifiez les informations de la saison."
            : "Remplissez le formulaire pour créer une nouvelle saison."
        }
        icon={<CalendarDays size={20} />}
        sections={sections}
        initialValues={initialValues}
        submitLabel={
          loading
            ? "Enregistrement..."
            : saison
              ? "Enregistrer les modifications"
              : "Ajouter la saison"
        }
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}
