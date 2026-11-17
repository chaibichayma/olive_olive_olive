

import { useState } from "react";
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

import { utilisateursData } from "./data/utilisateur.data";
import type { Utilisateur } from "./types/utilisateur.types";

import AjouterModifierPage from "./AjouterModifierPage";

import Footer from "../../components/common/Footer";
import Pagination from "../../components/tables/Pagination";

import { FilterPanel } from "../../components/filters";
import type {
  FilterField,
  FilterValues,
} from "../../components/filters";

import EmptyState from "../../components/common/EmptyState";
import ContactCards from "../../components/common/ContactCards";

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
    useState<Utilisateur[]>(utilisateursData);

  const [filteredUtilisateurs, setFilteredUtilisateurs] =
    useState<Utilisateur[]>(utilisateursData);

  const [selectedUtilisateur, setSelectedUtilisateur] =
    useState<Utilisateur | null>(null);

  const [showForm, setShowForm] = useState(false);

  // ==========================================
  // OUVRIR LE FORMULAIRE D'AJOUT
  // ==========================================

  const handleAdd = () => {
    setSelectedUtilisateur(null);
    setShowForm(true);
  };

  // ==========================================
  // OUVRIR LE FORMULAIRE DE MODIFICATION
  // ==========================================

  const handleEdit = (utilisateur: Utilisateur) => {
    setSelectedUtilisateur(utilisateur);
    setShowForm(true);
  };

  // ==========================================
  // SUPPRIMER UN UTILISATEUR
  // ==========================================

  const handleDelete = (utilisateur: Utilisateur) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer l'utilisateur ${utilisateur.displayName} ?`
    );

    if (!confirmed) return;

    const updatedUtilisateurs = utilisateurs.filter(
      (item) => item.id !== utilisateur.id
    );

    setUtilisateurs(updatedUtilisateurs);
    setFilteredUtilisateurs((previous) =>
      previous.filter((item) => item.id !== utilisateur.id)
    );
  };

  // ==========================================
  // ENREGISTRER AJOUT / MODIFICATION
  // ==========================================

  const handleSave = (values: FilterValues) => {
    const utilisateurData: Utilisateur = {
      id: selectedUtilisateur
        ? selectedUtilisateur.id
        : Math.max(0, ...utilisateurs.map((item) => item.id)) + 1,

      displayName: values.displayName.trim(),
      userName: values.userName.trim(),
      mail: values.mail.trim(),

      // Conserver le mot de passe existant si aucun
      // nouveau mot de passe n'est renseigné.
      password:
        values.password ||
        selectedUtilisateur?.password ||
        "",

      userCode: values.userCode.trim(),
      isActive: values.isActive === "true",
      image:
        values.image ||
        selectedUtilisateur?.image ||
        "",
    };

    let updatedUtilisateurs: Utilisateur[];

    if (selectedUtilisateur) {
      // MODIFICATION

      updatedUtilisateurs = utilisateurs.map((item) =>
        item.id === selectedUtilisateur.id
          ? utilisateurData
          : item
      );
    } else {
      // AJOUT

      updatedUtilisateurs = [
        ...utilisateurs,
        utilisateurData,
      ];
    }

    setUtilisateurs(updatedUtilisateurs);
    setFilteredUtilisateurs(updatedUtilisateurs);

    // Fermer le formulaire
    setShowForm(false);
    setSelectedUtilisateur(null);
  };

  // ==========================================
  // ANNULER LE FORMULAIRE
  // ==========================================

  const handleCancel = () => {
    setShowForm(false);
    setSelectedUtilisateur(null);
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
          .includes(filters.displayName.toLowerCase());

      // Recherche par nom d'utilisateur
      const matchesUserName =
        !filters.userName ||
        utilisateur.userName
          .toLowerCase()
          .includes(filters.userName.toLowerCase());

      // Recherche par e-mail
      const matchesMail =
        !filters.mail ||
        utilisateur.mail
          .toLowerCase()
          .includes(filters.mail.toLowerCase());

      // Filtre par statut
      const matchesStatus =
        !filters.isActive ||
        utilisateur.isActive ===
          (filters.isActive === "true");

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

      {/* CARTES DES UTILISATEURS */}

      <Card padding="md">

        <div className="mt-4">

          {filteredUtilisateurs.length > 0 ? (

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
              description="Essayez de modifier vos critères de filtrage."
            />

          )}

        </div>

      </Card>

      {/* FOOTER */}

      <Footer />

    </div>
  );
}
