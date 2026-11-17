
import { useMemo } from "react";
import { Wallet } from "lucide-react";

import { FormPageLayout } from "../../components/forms";
import type {
  FormSection,
  FormValues,
} from "../../components/forms";

import type { Compte } from "./types/compte.types";

// ==========================================
// PROPRIÉTÉS
// ==========================================

interface AjouterModifierPageProps {
  compte?: Compte | null;
  onSave: (values: FormValues) => void;
  onCancel: () => void;
}

// ==========================================
// AJOUT / MODIFICATION D'UN COMPTE
// ==========================================

export default function AjouterModifierPage({
  compte,
  onSave,
  onCancel,
}: AjouterModifierPageProps) {

  // ==========================================
  // VALEURS INITIALES
  // ==========================================

  const initialValues = useMemo<FormValues>(
    () => ({
      image: compte?.image ?? "",
      name: compte?.name ?? "",
      mobile: compte?.mobile ?? "",
      mail: compte?.mail ?? "",
      adresse: compte?.adresse ?? "",
      statusId: String(compte?.statusId ?? 1),
      isBaseCompte: String(compte?.isBaseCompte ?? true),
      priceConv:
        compte?.priceConv != null
          ? String(compte.priceConv)
          : "",
      baseCompteId:
        compte?.baseCompteId != null
          ? String(compte.baseCompteId)
          : "",
    }),
    [compte]
  );

  // ==========================================
  // SECTION DU FORMULAIRE
  // ==========================================

  const sections: FormSection[] = [
    {
      title: "Informations du compte",
      description:
        "Renseignez les informations générales et les paramètres du compte.",
      icon: (
        <Wallet
          size={16}
          className="text-[#47785B]"
        />
      ),
      columns: 3,

      fields: [

        // IMAGE À GAUCHE : 4 LIGNES

        {
          name: "image",
          label: "Photo du compte",
          type: "image",
          accept: "image/png,image/jpeg,image/webp",
          rowSpan: 4,
        },

        // LIGNE 1

        {
          name: "name",
          label: "Nom du compte",
          placeholder: "Saisir le nom du compte",
          required: true,
        },
        {
          name: "mobile",
          label: "Téléphone",
          placeholder: "Saisir le numéro de téléphone",
          required: true,
        },

        // LIGNE 2

        {
          name: "mail",
          label: "Adresse électronique",
          type: "email",
          placeholder: "exemple@email.com",
        },
        {
          name: "adresse",
          label: "Adresse",
          placeholder: "Saisir l'adresse",
        },

        // LIGNE 3

        {
          name: "statusId",
          label: "Statut",
          type: "select",
          required: true,
          placeholder: "Sélectionner un statut",
          options: [
            { label: "Statut 1", value: "1" },
            { label: "Statut 2", value: "2" },
          ],
        },
        {
          name: "isBaseCompte",
          label: "Type de compte",
          type: "select",
          required: true,
          placeholder: "Sélectionner un type",
          options: [
            { label: "Compte de base", value: "true" },
            { label: "Compte rattaché", value: "false" },
          ],
        },

        // LIGNE 4

        {
          name: "priceConv",
          label: "Prix de conversion",
          type: "number",
          placeholder: "0.000",
        },
        {
          name: "baseCompteId",
          label: "Identifiant du compte de base",
          type: "number",
          placeholder: "Identifiant du compte",
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
        compte
          ? "Modifier le compte"
          : "Ajouter un compte"
      }
      description={
        compte
          ? "Modifiez les informations du compte."
          : "Remplissez le formulaire pour créer un nouveau compte."
      }
      icon={<Wallet size={20} />}
      sections={sections}
      initialValues={initialValues}
      submitLabel={
        compte
          ? "Enregistrer les modifications"
          : "Ajouter le compte"
      }
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
}
