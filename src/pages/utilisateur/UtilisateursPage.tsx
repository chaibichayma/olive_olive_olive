
import { useCallback, useEffect, useState } from "react";
import {
  Users,
  Search,
  CircleCheck,
  ReceiptText,
  UserRound,
  AtSign,
  Mail,
  LockKeyhole,
} from "lucide-react";

import { Card } from "../../components/ui";
import { PageHeader } from "../../components/common";

import type { Utilisateur } from "./types/utilisateur.types";

import AjouterModifierPage from "./AjouterModifierPage";

import Footer from "../../components/common/Footer";
import Pagination from "../../components/tables/Pagination";

import { FilterPanel } from "../../components/filters";
import type {
  FilterField,
  FilterValues,
} from "../../components/filters";

import type { FormValues } from "../../components/forms";

import EmptyState from "../../components/common/EmptyState";
import ContactCards from "../../components/common/ContactCards";

import {
  getListBean,
  getUserById,
  deleteUser,
} from "../../services/userService";

import type { User as UserApi } from "../../models/user.model";

// ==========================================
// CONVERSION BACKEND -> FRONTEND
// ==========================================

const mapApiUser = (item: UserApi): Utilisateur => {
  if (item.id == null || !Number.isFinite(Number(item.id))) {
    console.error("Identifiant utilisateur invalide :", item);
    throw new Error("Identifiant invalide pour un utilisateur.");
  }

  return {
    id: Number(item.id),
    displayName: item.displayName ?? "",
    userName: item.userName ?? "",
    mail: item.mail ?? "",
    password: "",
    userCode: item.userCode ?? "",
    isActive: item.isActive ?? true,
    image: "",
  };
};

// ==========================================
// FILTRES DES UTILISATEURS
// ==========================================

const utilisateurFilters: FilterField[] = [
  {
    type: "search",
    name: "displayName",
    label: "Nom complet",
    placeholder: "Rechercher par nom...",
    icon: Search,
  },
  {
    type: "search",
    name: "userName",
    label: "Nom d'utilisateur",
    placeholder: "Rechercher par identifiant...",
    icon: UserRound,
  },
  {
    type: "search",
    name: "mail",
    label: "E-mail",
    placeholder: "Rechercher par e-mail...",
    icon: Mail,
  },
  {
    type: "select",
    name: "isActive",
    label: "Statut",
    placeholder: "Tous les statuts",
    icon: CircleCheck,
    options: [
      { label: "Actif", value: "true" },
      { label: "Inactif", value: "false" },
    ],
  },
];

// ==========================================
// PAGE CONSULTATION DES UTILISATEURS
// ==========================================

export default function UtilisateursPage() {

  // ==========================================
  // ÉTATS
  // ==========================================

  const [utilisateurs, setUtilisateurs] =
    useState<Utilisateur[]>([]);

  const [filteredUtilisateurs, setFilteredUtilisateurs] =
    useState<Utilisateur[]>([]);

  const [selectedUtilisateur, setSelectedUtilisateur] =
    useState<Utilisateur | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================
  // CHARGER LES UTILISATEURS
  // GET /user/getListBean
  // ==========================================

  const fetchUtilisateurs = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getListBean();

      console.log("Liste des utilisateurs reçue :", data);

      const result = data.map(mapApiUser);

      setUtilisateurs(result);
      setFilteredUtilisateurs(result);

    } catch (error) {
      console.error("Erreur chargement des utilisateurs :", error);

      setErrorMessage(
        "Impossible de récupérer les utilisateurs depuis le serveur."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // CHARGEMENT INITIAL
  // ==========================================

  useEffect(() => {
    fetchUtilisateurs();
  }, [fetchUtilisateurs]);

  // ==========================================
  // OUVRIR LE FORMULAIRE D'AJOUT
  // ==========================================

  const handleAdd = () => {
    setSelectedUtilisateur(null);
    setErrorMessage("");
    setShowForm(true);
  };

  // ==========================================
  // OUVRIR LE FORMULAIRE DE MODIFICATION
  // GET /user/getId/{id}
  // ==========================================

  const handleEdit = async (utilisateur: Utilisateur) => {
    try {
      setActionLoading(true);
      setErrorMessage("");

      const data = await getUserById(utilisateur.id);

      const mappedUtilisateur = mapApiUser(data);

      setSelectedUtilisateur(mappedUtilisateur);
      setShowForm(true);

    } catch (error) {
      console.error("Erreur récupération utilisateur :", error);

      setErrorMessage(
        "Impossible de récupérer les informations de cet utilisateur."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // SUPPRIMER UN UTILISATEUR
  // POST /user/delete/{id}
  // ==========================================

  const handleDelete = async (utilisateur: Utilisateur) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer l'utilisateur ${utilisateur.displayName} ?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setErrorMessage("");

      const response = await deleteUser(utilisateur.id);

      if (response.isValid === false) {
        throw new Error(
          response.message || "La suppression a échoué."
        );
      }

      // Actualiser la liste depuis le backend
      await fetchUtilisateurs();

    } catch (error) {
      console.error("Erreur suppression utilisateur :", error);

      setErrorMessage(
        "Impossible de supprimer cet utilisateur."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // ENREGISTRER AJOUT / MODIFICATION
  // Les appels save/update sont dans le formulaire.
  // ==========================================

  const handleSave = async (_values: FormValues) => {
    await fetchUtilisateurs();

    setShowForm(false);
    setSelectedUtilisateur(null);
  };

  // ==========================================
  // ANNULER LE FORMULAIRE
  // ==========================================

  const handleCancel = () => {
    setShowForm(false);
    setSelectedUtilisateur(null);
    setErrorMessage("");
  };

  // ==========================================
  // APPLIQUER LES FILTRES
  // ==========================================

  const handleFilter = (filters: FilterValues) => {
    const result = utilisateurs.filter((utilisateur) => {

      // Recherche par nom complet
      const matchesDisplayName =
        !filters.displayName ||
        utilisateur.displayName
          .toLowerCase()
          .includes(String(filters.displayName).toLowerCase());

      // Recherche par nom d'utilisateur
      const matchesUserName =
        !filters.userName ||
        utilisateur.userName
          .toLowerCase()
          .includes(String(filters.userName).toLowerCase());

      // Recherche par e-mail
      const matchesMail =
        !filters.mail ||
        utilisateur.mail
          .toLowerCase()
          .includes(String(filters.mail).toLowerCase());

      // Filtre par statut
      const matchesStatus =
        !filters.isActive ||
        utilisateur.isActive === (filters.isActive === "true");

      return (
        matchesDisplayName &&
        matchesUserName &&
        matchesMail &&
        matchesStatus
      );
    });

    setFilteredUtilisateurs(result);
  };

  // ==========================================
  // RÉINITIALISER LES FILTRES
  // ==========================================

  const handleReset = () => {
    setFilteredUtilisateurs(utilisateurs);
  };

  // ==========================================
  // AFFICHAGE DU FORMULAIRE
  // ==========================================

  if (showForm) {
    return (
      <div className="mx-auto w-full max-w-[1450px] space-y-4">

        <AjouterModifierPage
          utilisateur={selectedUtilisateur}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        {errorMessage && (
          <p className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <Footer />

      </div>
    );
  }

  // ==========================================
  // AFFICHAGE DE LA LISTE
  // ==========================================

  return (
    <div className="mx-auto w-full max-w-[1450px] space-y-3 sm:space-y-4">

      {/* PAGE HEADER */}

      <PageHeader
        title="Liste des utilisateurs"
        description="Consultez et gérez les différents utilisateurs."
        addLabel="Ajouter un utilisateur"
        onAdd={handleAdd}
      />

      {/* FILTRES */}

      <FilterPanel
        title="Filtres - Utilisateurs"
        icon={<Users size={18} />}
        fields={utilisateurFilters}
        onApply={handleFilter}
        onReset={handleReset}
      />

      {/* MESSAGE D'ERREUR */}

      {errorMessage && (
        <p className="text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      {/* CARTES DES UTILISATEURS */}

      <Card padding="md">

        <div className="mt-4">

          {loading ? (

            <div className="py-8 text-center text-gray-500">
              Chargement des utilisateurs...
            </div>

          ) : actionLoading ? (

            <div className="py-8 text-center text-gray-500">
              Traitement en cours...
            </div>

          ) : filteredUtilisateurs.length > 0 ? (

            <Pagination
              key={filteredUtilisateurs
                .map((item) => item.id)
                .join("-")}
              data={filteredUtilisateurs}
              pageSize={8}
            >
              {(paginatedUtilisateurs) => (

                <ContactCards
                  data={paginatedUtilisateurs}
                  getKey={(user) => user.id}
                  getName={(user) => user.displayName}
                  getImage={(user) => user.image}
                  subtitle={(user) => `@${user.userName}`}
                  getDetails={(user) => [
                    {
                      icon: <AtSign size={12} />,
                      value: user.userName,
                    },
                    {
                      icon: <Mail size={12} />,
                      value: user.mail,
                    },
                    {
                      icon: <LockKeyhole size={12} />,
                      value: "••••••••",
                    },
                  ]}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />

              )}
            </Pagination>

          ) : (

            <EmptyState
              icon={<ReceiptText size={30} />}
              title="Aucun utilisateur trouvé"
              description={
                utilisateurs.length === 0
                  ? "Aucun utilisateur n'est disponible."
                  : "Essayez de modifier vos critères de filtrage."
              }
            />

          )}

        </div>

      </Card>

      {/* FOOTER */}

      <Footer />

    </div>
  );
}
