
import { useEffect, useState } from "react";
import { ReceiptText } from "lucide-react";

import { FormPageLayout } from "../../components/forms";
import type {
  FormValues,
  FormSection,
} from "../../components/forms";

import type { BonReception } from "./types/bonReception.types";
import { comptesData } from "../compte/data/compte.data";

import CaisseSelector from "../../components/bonReception/CaisseSelector";
import CompteHistory from "../../components/bonReception/CompteHistory";

// ==========================================
// PROPS
// ==========================================

interface AjouterModifierPageProps {
  bonReception?: BonReception | null;
  onSave: (values: FormValues) => void;
  onCancel: () => void;
}

// ==========================================
// FORMATAGE DES DATES
// ==========================================

const formatDateTimeLocal = (
  value?: string | null
): string => {
  if (!value) return "";
  return value.slice(0, 16);
};

// ==========================================
// FORMATAGE DES CAISSES
// ==========================================

const formatCaisses = (value?: string | null): string[] => {
  if (!value) return [];

  return value
    .split(",")
    .map((caisse) => caisse.trim())
    .filter(Boolean);
};

// ==========================================
// VALEURS INITIALES
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

  dateCreation: formatDateTimeLocal(bonReception?.dateCreation),
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
  // ÉTATS
  // ==========================================

  const [formInitialValues, setFormInitialValues] =
    useState<FormValues>(() => initialValues(bonReception));

  const [matchedCompte, setMatchedCompte] = useState(
    () =>
      comptesData.find(
        (compte) =>
          compte.id.toString() ===
          bonReception?.compteId?.toString()
      ) ?? null
  );

  // Sélection multiple des caisses
  const [selectedCaisses, setSelectedCaisses] = useState<string[]>(
    () => formatCaisses(bonReception?.caisse)
  );

  // ==========================================
  // SYNCHRONISATION
  // ==========================================

  useEffect(() => {
    setFormInitialValues(initialValues(bonReception));

    const compte = comptesData.find(
      (item) =>
        item.id.toString() ===
        bonReception?.compteId?.toString()
    );

    setMatchedCompte(compte ?? null);

    setSelectedCaisses(
      formatCaisses(bonReception?.caisse)
    );
  }, [bonReception]);

  // ==========================================
  // RECHERCHE DU COMPTE PAR TÉLÉPHONE
  // ==========================================

  const handleValuesChange = (
    values: FormValues
  ): FormValues | void => {
    const phone = (values.mobile ?? "").replace(/\s/g, "");

    if (!phone) {
      setMatchedCompte(null);

      return {
        compteId: "",
      };
    }

    const compte = comptesData.find(
      (item) =>
        item.mobile.replace(/\s/g, "") === phone
    );

    setMatchedCompte(compte ?? null);

    if (compte) {
      return {
        compteId: compte.id.toString(),
        name: compte.name,
        mobile: compte.mobile,
        isBaseCompte: compte.isBaseCompte.toString(),
      };
    }

    return {
      compteId: "",
    };
  };

  // ==========================================
  // SECTIONS DU FORMULAIRE
  // ==========================================

  const sections: FormSection[] = [
    {
      title: "Informations du bon de réception",
      description:
        "Informations générales, production, financières et dates de réception.",
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
          name: "quantityOlive",
          label: "Quantité d'olives (kg)",
          type: "number",
          placeholder: "0.000",
        },
        {
          name: "quantityOil",
          label: "Quantité d'huile obtenue",
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
  ];

  // ==========================================
  // CONTENU SUPPLÉMENTAIRE
  // ==========================================

  const extraContent = (
    <div className="space-y-4">

      {/* HISTORIQUE DU COMPTE */}
      {(isEditing || matchedCompte !== null) && (
        <CompteHistory />
      )}

      {/* SÉLECTION MULTIPLE DES CAISSES */}
      <CaisseSelector
        selectedCaisses={selectedCaisses}
        onChange={setSelectedCaisses}
      />

    </div>
  );

  // ==========================================
  // ENREGISTREMENT
  // ==========================================

  const handleSubmit = (values: FormValues) => {
    onSave({
      ...values,
      caisse: selectedCaisses.join(","),
    });
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
      onValuesChange={handleValuesChange}
      extraContent={extraContent}
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
