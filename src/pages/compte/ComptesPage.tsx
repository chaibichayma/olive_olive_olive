
import { useState } from "react";
import {
  Users,
  Search,
  Layers,
  CircleCheck,
  ReceiptText,
} from "lucide-react";

import { Card } from "../../components/ui";
import { PageHeader } from "../../components/common";

import { comptesData } from "./data/compte.data";
import type { Compte } from "./types/compte.types";

import Footer from "../../components/common/Footer";
import Pagination from "../../components/tables/Pagination";

import { FilterPanel } from "../../components/filters";
import type {
  FilterField,
  FilterValues,
} from "../../components/filters";

import EmptyState from "../../components/common/EmptyState";
import ContactCards from "../../components/common/ContactCards";

import AjouterModifierPage from "./AjouterModifierPage";
import type { FormValues } from "../../components/forms";

// ==========================================
// FILTRES DES COMPTES
// ==========================================

const statusOptions = [
  ...new Set(comptesData.map((compte) => compte.statusId)),
].sort((a, b) => a - b);

const compteFilters: FilterField[] = [
  {
    type: "search",
    name: "name",
    label: "Nom du compte",
    placeholder: "Rechercher par nom...",
    icon: Search,
  },
  {
    type: "search",
    name: "mobile",
    label: "Téléphone",
    placeholder: "Rechercher par téléphone...",
  },
  {
    type: "select",
    name: "statusId",
    label: "Statut",
    placeholder: "Tous les statuts",
    icon: CircleCheck,
    options: statusOptions.map((statusId) => ({
      label: `Statut ${statusId}`,
      value: String(statusId),
    })),
  },
  {
    type: "select",
    name: "isBaseCompte",
    label: "Type de compte",
    placeholder: "Tous les types",
    icon: Layers,
    options: [
      { label: "Compte de base", value: "true" },
      { label: "Compte rattaché", value: "false" },
    ],
  },
];

// ==========================================
// PAGE CONSULTATION DES COMPTES
// ==========================================

export default function ComptesPage() {
  const [comptes, setComptes] = useState<Compte[]>(comptesData);

  const [filteredComptes, setFilteredComptes] =
    useState<Compte[]>(comptesData);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [selectedCompte, setSelectedCompte] =
    useState<Compte | null>(null);

  // ==========================================
  // OUVRIR LE FORMULAIRE D'AJOUT
  // ==========================================

  const handleAdd = () => {
    setSelectedCompte(null);
    setIsFormOpen(true);
  };

  // ==========================================
  // OUVRIR LE FORMULAIRE DE MODIFICATION
  // ==========================================

  const handleEdit = (compte: Compte) => {
    setSelectedCompte(compte);
    setIsFormOpen(true);
  };

  // ==========================================
  // FERMER LE FORMULAIRE
  // ==========================================

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedCompte(null);
  };

  // ==========================================
  // ENREGISTRER : AJOUT / MODIFICATION
  // ==========================================

  const handleSave = (values: FormValues) => {
    if (selectedCompte) {
      // MODIFICATION

      const updatedCompte: Compte = {
        ...selectedCompte,
        name: values.name ?? "",
        adresse: values.adresse ?? "",
        mobile: values.mobile ?? "",
        mail: values.mail ?? "",
        statusId: Number(values.statusId),
        priceConv: values.priceConv
          ? Number(values.priceConv)
          : null,
        isBaseCompte: values.isBaseCompte === "true",
        baseCompteId: values.baseCompteId
          ? Number(values.baseCompteId)
          : null,
      };

      const updatedComptes = comptes.map((compte) =>
        compte.id === selectedCompte.id
          ? updatedCompte
          : compte
      );

      setComptes(updatedComptes);
      setFilteredComptes((previous) =>
        previous.map((compte) =>
          compte.id === selectedCompte.id
            ? updatedCompte
            : compte
        )
      );
    } else {
      // AJOUT

      const newCompte: Compte = {
        id: Math.max(0, ...comptes.map((compte) => compte.id)) + 1,
        name: values.name ?? "",
        adresse: values.adresse ?? "",
        mobile: values.mobile ?? "",
        mail: values.mail ?? "",
        statusId: Number(values.statusId),
        priceConv: values.priceConv
          ? Number(values.priceConv)
          : null,
        isBaseCompte: values.isBaseCompte === "true",
        baseCompteId: values.baseCompteId
          ? Number(values.baseCompteId)
          : null,
        image: "https://i.pravatar.cc/120?img=12",
      };

      setComptes((previous) => [...previous, newCompte]);
      setFilteredComptes((previous) => [...previous, newCompte]);
    }

    handleCancel();
  };

  // ==========================================
  // SUPPRIMER UN COMPTE
  // ==========================================

  const handleDelete = (compte: Compte) => {
    const confirmed = window.confirm(
      `Voulez-vous supprimer le compte "${compte.name}" ?`
    );

    if (!confirmed) return;

    const updatedComptes = comptes.filter(
      (item) => item.id !== compte.id
    );

    setComptes(updatedComptes);
    setFilteredComptes((previous) =>
      previous.filter((item) => item.id !== compte.id)
    );
  };

  // ==========================================
  // APPLIQUER LES FILTRES
  // ==========================================

  const handleFilter = (filters: FilterValues) => {
    const result = comptes.filter((compte) => {
      const matchesName =
        !filters.name ||
        compte.name
          .toLowerCase()
          .includes(filters.name.toLowerCase());

      const matchesMobile =
        !filters.mobile ||
        compte.mobile.includes(filters.mobile);

      const matchesStatus =
        !filters.statusId ||
        compte.statusId === Number(filters.statusId);

      const matchesType =
        !filters.isBaseCompte ||
        compte.isBaseCompte ===
          (filters.isBaseCompte === "true");

      return (
        matchesName &&
        matchesMobile &&
        matchesStatus &&
        matchesType
      );
    });

    setFilteredComptes(result);
  };

  // ==========================================
  // RÉINITIALISER LES FILTRES
  // ==========================================

  const handleReset = () => {
    setFilteredComptes(comptes);
  };

  // ==========================================
  // AFFICHAGE DU FORMULAIRE
  // ==========================================

  if (isFormOpen) {
    return (
      <div className="mx-auto w-full max-w-[1450px] space-y-4">
        <AjouterModifierPage
          compte={selectedCompte}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        <Footer />
      </div>
    );
  }

  // ==========================================
  // AFFICHAGE DE LA PAGE COMPTES
  // ==========================================

  return (
    <div className="mx-auto w-full max-w-[1450px] space-y-3 sm:space-y-4">

      {/* PAGE HEADER */}

      <PageHeader
        title="Liste des comptes"
        description="Consultez et gérez les différents comptes."
        addLabel="Ajouter un compte"
        onAdd={handleAdd}
      />

      {/* FILTRES */}

      <FilterPanel
        title="Filtres - Comptes"
        icon={<Users size={18} />}
        fields={compteFilters}
        onApply={handleFilter}
        onReset={handleReset}
      />

      {/* CARTES DES COMPTES */}

      <Card padding="md">
        <div className="mt-4">

          {filteredComptes.length > 0 ? (
            <Pagination
              key={filteredComptes.map((item) => item.id).join("-")}
              data={filteredComptes}
              pageSize={8}
            >
              {(paginatedComptes) => (
                <ContactCards
                  data={paginatedComptes}
                  getKey={(compte) => compte.id}
                  getName={(compte) => compte.name}
                  getImage={(compte) => compte.image}
                  getAddress={(compte) => compte.adresse}
                  getMobile={(compte) => compte.mobile}
                  getEmail={(compte) => compte.mail}
                  subtitle={() => "Compte"}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </Pagination>
          ) : (
            <EmptyState
              icon={<ReceiptText size={30} />}
              title="Aucun compte trouvé"
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
