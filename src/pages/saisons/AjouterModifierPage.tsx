
import { useMemo } from "react";
import { CalendarDays } from "lucide-react";

import { FormPageLayout } from "../../components/forms";
import type {
  FormSection,
  FormValues,
} from "../../components/forms";

import type { Saison } from "./types/saison.types";

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

        // PREMIÈRE LIGNE

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

        // DEUXIÈME LIGNE

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

        // TROISIÈME LIGNE

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

        // QUATRIÈME LIGNE

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
        saison
          ? "Enregistrer les modifications"
          : "Ajouter la saison"
      }
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
}

