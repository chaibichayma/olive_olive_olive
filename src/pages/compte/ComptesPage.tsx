
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  Layers,
  CircleCheck,
  ReceiptText,
} from "lucide-react";

import { Card } from "../../components/ui";
import { PageHeader } from "../../components/common";

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

import {
  getListBean,
  getCompteById,
  deleteCompte,
} from "../../services/compteService";

import type {
  Compte as CompteApi,
} from "../../models/compte.model";

// ==========================================
// CONVERSION BACKEND -> FRONTEND
// ==========================================

const mapApiCompte = (item: CompteApi): Compte => {
  console.log("Compte reçu du backend :", item);

  const rawId = item.id ?? item.compteId;

  if (rawId == null || !Number.isFinite(Number(rawId))) {
    console.error("Identifiant manquant :", item);
    throw new Error("Identifiant invalide pour un compte.");
  }

  return {
    id: Number(rawId),
    reference: item.reference ?? "",
    name: item.name ?? "",
    adresse: "",
    mobile: item.mobile ?? "",
    mail: "",
    statusId: 1,
    priceConv: item.priceKg ?? null,
    isBaseCompte: item.isBaseCompte ?? true,
    baseCompteId: null,
    image: "",
  };
};

// ==========================================
// PAGE CONSULTATION DES COMPTES
// ==========================================

export default function ComptesPage() {

  // ==========================================
  // ÉTATS
  // ==========================================

  const [comptes, setComptes] = useState<Compte[]>([]);

  const [filteredComptes, setFilteredComptes] =
    useState<Compte[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [selectedCompte, setSelectedCompte] =
    useState<Compte | null>(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================
  // CHARGER LES COMPTES
  // GET /compte/getListBean
  // ==========================================

  const fetchComptes = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getListBean();

      const result = data.map(mapApiCompte);

      setComptes(result);
      setFilteredComptes(result);

    } catch (error) {
      console.error("Erreur chargement des comptes :", error);

      setErrorMessage(
        "Impossible de récupérer les comptes depuis le serveur."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // CHARGEMENT INITIAL
  // ==========================================

  useEffect(() => {
    fetchComptes();
  }, [fetchComptes]);

  // ==========================================
  // FILTRES DES COMPTES
  // ==========================================

  const compteFilters: FilterField[] = useMemo(() => {

    const statusOptions = [
      ...new Set(comptes.map((compte) => compte.statusId)),
    ].sort((a, b) => a - b);

    return [
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
  }, [comptes]);

  // ==========================================
  // OUVRIR LE FORMULAIRE D'AJOUT
  // ==========================================

  const handleAdd = () => {
    setSelectedCompte(null);
    setErrorMessage("");
    setIsFormOpen(true);
  };

  // ==========================================
  // OUVRIR LE FORMULAIRE DE MODIFICATION
  // GET /compte/getId/{id}
  // ==========================================

  const handleEdit = async (compte: Compte) => {
    try {
      setActionLoading(true);
      setErrorMessage("");

      const data = await getCompteById(compte.id);

      const mappedCompte = mapApiCompte(data);

      setSelectedCompte(mappedCompte);
      setIsFormOpen(true);

    } catch (error) {
      console.error("Erreur récupération du compte :", error);

      setErrorMessage(
        "Impossible de récupérer les informations de ce compte."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // FERMER LE FORMULAIRE
  // ==========================================

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedCompte(null);
    setErrorMessage("");
  };

  // ==========================================
  // ACTUALISER APRÈS AJOUT / MODIFICATION
  // Les appels save/update sont dans le formulaire.
  // ==========================================

  const handleSave = async (_values: FormValues) => {
    await fetchComptes();
    handleCancel();
  };

  // ==========================================
  // SUPPRIMER UN COMPTE
  // POST /compte/delete/{id}
  // ==========================================

  const handleDelete = async (compte: Compte) => {

    const confirmed = window.confirm(
      `Voulez-vous supprimer le compte "${compte.name}" ?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setErrorMessage("");

      const response = await deleteCompte(compte.id);

      if (!response.isValid) {
        throw new Error(
          response.message || "La suppression du compte a échoué."
        );
      }

      // Actualiser la liste depuis le backend
      await fetchComptes();

    } catch (error) {
      console.error("Erreur suppression du compte :", error);

      setErrorMessage(
        "Impossible de supprimer ce compte."
      );
    } finally {
      setActionLoading(false);
    }
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
          .includes(String(filters.name).toLowerCase());

      const matchesMobile =
        !filters.mobile ||
        compte.mobile.includes(String(filters.mobile));

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

      {/* MESSAGE D'ERREUR */}

      {errorMessage && (
        <p className="text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      {/* CARTES DES COMPTES */}

      <Card padding="md">
        <div className="mt-4">

          {loading ? (

            <div className="py-8 text-center text-gray-500">
              Chargement des comptes...
            </div>

          ) : filteredComptes.length > 0 ? (

            <Pagination
              key={filteredComptes
                .map((item) => item.id)
                .join("-")}
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
              description={
                comptes.length === 0
                  ? "Aucun compte n'est disponible."
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
