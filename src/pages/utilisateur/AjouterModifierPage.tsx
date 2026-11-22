
import { useMemo, useState } from "react";
import { UserRound } from "lucide-react";

import { FormPageLayout } from "../../components/forms";
import type {
  FormSection,
  FormValues,
} from "../../components/forms";

import type { Utilisateur } from "./types/utilisateur.types";

import {
  saveUser,
  updateUser,
} from "../../services/userService";

import type { UserRequest } from "../../models/user.model";

// ==========================================
// PROPRIÉTÉS
// ==========================================

interface AjouterModifierPageProps {
  utilisateur?: Utilisateur | null;
  onSave: (values: FormValues) => void | Promise<void>;
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

  const isEditing = Boolean(utilisateur);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
  // ENREGISTRER : AJOUT / MODIFICATION
  // ==========================================

  const handleSubmit = async (values: FormValues) => {
    if (loading) return;

    try {
      setLoading(true);
      setErrorMessage("");

      // Préparer les données selon le modèle Swagger
      const userData: UserRequest = {
        displayName: String(values.displayName ?? "").trim(),
        userName: String(values.userName ?? "").trim(),
        mail: String(values.mail ?? "").trim(),
        userCode: String(values.userCode ?? "").trim(),
        isActive: values.isActive === "true",
        roles: [],
      };

      // Ajouter le mot de passe seulement s'il est renseigné
      const password = String(values.password ?? "").trim();

      if (password) {
        userData.password = password;
      }

      // Vérifications
      if (
        !userData.displayName ||
        !userData.userName ||
        !userData.mail ||
        !userData.userCode
      ) {
        setErrorMessage(
          "Veuillez remplir tous les champs obligatoires."
        );
        return;
      }

      if (!isEditing && !password) {
        setErrorMessage("Le mot de passe est obligatoire.");
        return;
      }

      if (isEditing && utilisateur) {
        // MODIFICATION
        await updateUser({
          ...userData,
          id: utilisateur.id,
        });

        console.log("Utilisateur modifié avec succès.");

      } else {
        // AJOUT
        await saveUser(userData);

        console.log("Utilisateur créé avec succès.");
      }

      // Actualiser la liste dans la page parent
      await onSave(values);

    } catch (error: any) {
      console.error("Erreur enregistrement utilisateur :", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      setErrorMessage(
        error.response?.data?.message ??
          "Une erreur est survenue lors de l'enregistrement de l'utilisateur."
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
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {errorMessage}
        </div>
      )}

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
          loading
            ? "Enregistrement..."
            : utilisateur
              ? "Enregistrer les modifications"
              : "Ajouter l'utilisateur"
        }
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />

    </div>
  );
}
