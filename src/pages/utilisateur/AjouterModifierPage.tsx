
import { useMemo } from "react";
import { UserRound } from "lucide-react";

import { FormPageLayout } from "../../components/forms";
import type {
  FormSection,
  FormValues,
} from "../../components/forms";

import type { Utilisateur } from "./types/utilisateur.types";

// ==========================================
// PROPRIÉTÉS
// ==========================================

interface AjouterModifierPageProps {
  utilisateur?: Utilisateur | null;
  onSave: (values: FormValues) => void;
  onCancel: () => void;
}

// ==========================================
// AJOUT / MODIFICATION D'UN UTILISATEUR
// ==========================================

export default function AjouterModifierPage({
  utilisateur,
  onSave,
  onCancel,
}: AjouterModifierPageProps) {

  // ==========================================
  // VALEURS INITIALES
  // ==========================================

  const initialValues = useMemo<FormValues>(
    () => ({
      image: utilisateur?.image ?? "",
      displayName: utilisateur?.displayName ?? "",
      userName: utilisateur?.userName ?? "",
      mail: utilisateur?.mail ?? "",
      password: utilisateur?.password ?? "",
      userCode: utilisateur?.userCode ?? "",
      isActive: String(utilisateur?.isActive ?? true),
    }),
    [utilisateur]
  );

  // ==========================================
  // SECTION DU FORMULAIRE
  // ==========================================

  const sections: FormSection[] = [
    {
      title: "Informations de l'utilisateur",
      description:
        "Renseignez les informations générales de l'utilisateur.",
      icon: (
        <UserRound
          size={16}
          className="text-[#47785B]"
        />
      ),
      columns: 3,

      fields: [

        // IMAGE À GAUCHE

        {
          name: "image",
          label: "Photo de l'utilisateur",
          type: "image",
          accept: "image/png,image/jpeg,image/webp",
          rowSpan: 3,
        },

        // PREMIÈRE LIGNE

        {
          name: "displayName",
          label: "Nom et prénom",
          placeholder: "Saisir le nom et prénom",
          required: true,
        },
        {
          name: "userName",
          label: "Nom d'utilisateur",
          placeholder: "Saisir le nom d'utilisateur",
          required: true,
        },

        // DEUXIÈME LIGNE

        {
          name: "mail",
          label: "Adresse électronique",
          type: "email",
          placeholder: "exemple@email.com",
          required: true,
        },
        {
          name: "password",
          label: "Mot de passe",
          type: "password",
          placeholder: utilisateur
            ? "Saisir un nouveau mot de passe"
            : "Saisir le mot de passe",
          required: !utilisateur,
        },

        // TROISIÈME LIGNE

        {
          name: "userCode",
          label: "Code utilisateur",
          placeholder: "Saisir le code utilisateur",
          required: true,
        },
        {
          name: "isActive",
          label: "Statut",
          type: "select",
          required: true,
          placeholder: "Sélectionner un statut",
          options: [
            {
              label: "Actif",
              value: "true",
            },
            {
              label: "Inactif",
              value: "false",
            },
          ],
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
        utilisateur
          ? "Modifier l'utilisateur"
          : "Ajouter un utilisateur"
      }
      description={
        utilisateur
          ? "Modifiez les informations de l'utilisateur."
          : "Remplissez le formulaire pour créer un nouvel utilisateur."
      }
      icon={<UserRound size={20} />}
      sections={sections}
      initialValues={initialValues}
      submitLabel={
        utilisateur
          ? "Enregistrer les modifications"
          : "Ajouter l'utilisateur"
      }
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
}
