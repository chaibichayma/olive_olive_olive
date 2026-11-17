
import { useEffect, useState } from "react";
import {
  ReceiptText,
  Droplets,
  Coins,
  CalendarDays,
  FileText,
} from "lucide-react";

import { FormPageLayout } from "../../components/forms";
import type {
  FormValues,
  FormSection,
  DateTimeItem,
} from "../../components/forms";

import type { BonReception } from "./types/bonReception.types";
import { comptesData } from "../compte/data/compte.data";

// ==========================================
// PROPS
// ==========================================

interface AjouterModifierPageProps {
  bonReception?: BonReception | null;
  onSave: (values: FormValues) => void;
  onCancel: () => void;
}

// ==========================================
// FORMATAGE DES DATES POUR datetime-local
// ==========================================

const formatDateTimeLocal = (
  value?: string | null
): string => {
  if (!value) return "";

  return value.slice(0, 16);
};

// ==========================================
// VALEURS INITIALES DU FORMULAIRE
// ==========================================

const initialValues = (
  bonReception?: BonReception | null
): FormValues => ({
  reference: bonReception?.reference ?? "",
  compteId: bonReception?.compteId?.toString() ?? "",

  name: bonReception?.name ?? "",
  mobile: bonReception?.mobile ?? "",

  quantityOil: bonReception?.quantityOil?.toString() ?? "",
  quantityOlive: bonReception?.quantityOlive?.toString() ?? "",

  priceKg: bonReception?.priceKg?.toString() ?? "",
  price: bonReception?.price?.toString() ?? "",
  payement: bonReception?.payement?.toString() ?? "",
  acompte: bonReception?.acompte?.toString() ?? "",
  priceOil: bonReception?.priceOil?.toString() ?? "",

  statusId: bonReception?.statusId ?? "",
  statusLib: bonReception?.statusLib ?? "",

  caisse: bonReception?.caisse ?? "",
  natureId: bonReception?.natureId?.toString() ?? "",
  typeHuile: bonReception?.typeHuile?.toString() ?? "",

  isBaseCompte:
    bonReception?.isBaseCompte === undefined
      ? "true"
      : bonReception.isBaseCompte.toString(),

  observation: bonReception?.observation ?? "",

  dateCreation: formatDateTimeLocal(
    bonReception?.dateCreation
  ),

  dateDebProduction: formatDateTimeLocal(
    bonReception?.dateDebProduction
  ),

  dateFinProduction: formatDateTimeLocal(
    bonReception?.dateFinProduction
  ),
});

// ==========================================
// PAGE AJOUTER / MODIFIER
// ==========================================

export default function AjouterModifierPage({
  bonReception,
  onSave,
  onCancel,
}: AjouterModifierPageProps) {
  const isEditing = Boolean(bonReception);

  // ==========================================
  // VALEURS INITIALES
  // ==========================================

  const [formInitialValues, setFormInitialValues] =
    useState<FormValues>(() => initialValues(bonReception));

  useEffect(() => {
    setFormInitialValues(initialValues(bonReception));
  }, [bonReception]);

  // ==========================================
  // SECTIONS DU FORMULAIRE
  // ==========================================

  const sections: FormSection[] = [

    // ------------------------------------------
    // 1. INFORMATIONS GÉNÉRALES
    // ------------------------------------------

    {
      title: "Informations générales",
      description: "Informations principales du bon de réception.",
      icon: <ReceiptText size={17} />,
      columns: 2,

      fields: [
        {
          name: "reference",
          label: "Référence",
          type: "text",
          placeholder: "Ex : BR-2026-001",
          required: true,
        },
        {
          name: "compteId",
          label: "Compte",
          type: "select",
          placeholder: "Sélectionner un compte",
          required: true,
          options: comptesData.map((compte) => ({
            label: compte.name,
            value: compte.id.toString(),
          })),
        },
        {
          name: "name",
          label: "Nom du client",
          type: "text",
          placeholder: "Nom du client",
        },
        {
          name: "mobile",
          label: "Téléphone",
          type: "text",
          placeholder: "Numéro de téléphone",
        },
        {
          name: "caisse",
          label: "Caisse",
          type: "text",
          placeholder: "Ex : C-001",
        },
        {
          name: "isBaseCompte",
          label: "Compte de base",
          type: "select",
          placeholder: "Sélectionner",
          options: [
            { label: "Oui", value: "true" },
            { label: "Non", value: "false" },
          ],
        },
      ],
    },

    // ------------------------------------------
    // 2. INFORMATIONS DE PRODUCTION
    // ------------------------------------------

    {
      title: "Informations de production",
      description: "Quantités et caractéristiques de la production.",
      icon: <Droplets size={17} />,
      columns: 2,

      fields: [
        {
          name: "quantityOil",
          label: "Quantité d'huile",
          type: "number",
          placeholder: "0.000",
        },
        {
          name: "quantityOlive",
          label: "Quantité d'olives",
          type: "number",
          placeholder: "0.000",
        },
        {
          name: "natureId",
          label: "Nature (ID)",
          type: "number",
          placeholder: "Identifiant de la nature",
        },
        {
          name: "typeHuile",
          label: "Type d'huile (ID)",
          type: "number",
          placeholder: "Identifiant du type d'huile",
        },
        {
          name: "statusId",
          label: "Statut (ID)",
          type: "text",
          placeholder: "Ex : 1",
        },
        {
          name: "statusLib",
          label: "Libellé du statut",
          type: "text",
          placeholder: "Ex : En cours",
        },
      ],
    },

    // ------------------------------------------
    // 3. INFORMATIONS FINANCIÈRES
    // ------------------------------------------

    {
      title: "Informations financières",
      description: "Prix, paiements et acompte.",
      icon: <Coins size={17} />,
      columns: 2,

      fields: [
        {
          name: "priceKg",
          label: "Prix par kg",
          type: "number",
          placeholder: "0.000",
        },
        {
          name: "priceOil",
          label: "Prix de l'huile",
          type: "number",
          placeholder: "0.000",
        },
        {
          name: "price",
          label: "Prix total",
          type: "number",
          placeholder: "0.000",
        },
        {
          name: "payement",
          label: "Paiement",
          type: "number",
          placeholder: "0.000",
        },
        {
          name: "acompte",
          label: "Acompte",
          type: "number",
          placeholder: "0.000",
        },
      ],
    },

    // ------------------------------------------
    // 4. DATES DE PRODUCTION
    // ------------------------------------------

    {
      title: "Dates de production",
      description: "Dates de création et de production du bon.",
      icon: <CalendarDays size={17} />,
      columns: 2,

      fields: [
        {
          name: "dateCreation",
          label: "Date de création",
          type: "datetime-local",
        },
        {
          name: "dateDebProduction",
          label: "Début de production",
          type: "datetime-local",
        },
        {
          name: "dateFinProduction",
          label: "Fin de production",
          type: "datetime-local",
        },
      ],
    },

    // ------------------------------------------
    // 5. INFORMATIONS COMPLÉMENTAIRES
    // ------------------------------------------

    {
      title: "Informations complémentaires",
      description: "Ajouter une remarque si nécessaire.",
      icon: <FileText size={17} />,
      columns: 2,

      fields: [
        {
          name: "observation",
          label: "Observation",
          type: "textarea",
          placeholder: "Saisir une observation...",
          colSpan: 2,
        },
      ],
    },
  ];

  // ==========================================
  // DATES ENREGISTRÉES
  // ==========================================

  const dateValues: DateTimeItem[] = bonReception
    ? [
        {
          label: "Date de création",
          value: bonReception.dateCreation,
        },
        {
          label: "Début de production",
          value: bonReception.dateDebProduction,
        },
        {
          label: "Fin de production",
          value: bonReception.dateFinProduction,
        },
      ]
    : [];

  // ==========================================
  // ENREGISTREMENT
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
        isEditing
          ? "Modifier le bon de réception"
          : "Ajouter un bon de réception"
      }
      description={
        isEditing
          ? "Modifier les informations du bon de réception."
          : "Remplir les informations pour créer un nouveau bon de réception."
      }
      icon={<ReceiptText size={20} />}
      sections={sections}
      initialValues={formInitialValues}
      dateValues={dateValues}
      dateTitle="Dates enregistrées"
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel={
        isEditing
          ? "Enregistrer les modifications"
          : "Ajouter"
      }
    />
  );
}
