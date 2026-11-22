
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Droplets,
  Layers,
  ReceiptText,
} from "lucide-react";

import { Card } from "../../components/ui";
import { PageHeader } from "../../components/common";

import type { Citerne } from "./types/citerne.types";
import AjouterModifierPage from "./AjouterModifierPage";
import type { FormValues } from "../../components/forms";

import Footer from "../../components/common/Footer";
import DateTimeDisplay from "../../components/common/DateTimeDisplay";
import DataTableSection from "../../components/tables/DataTableSection";
import Pagination from "../../components/tables/Pagination";
import type { TableColumn } from "../../components/tables";

import { FilterPanel } from "../../components/filters";
import type {
  FilterField,
  FilterValues,
} from "../../components/filters";

import EmptyState from "../../components/common/EmptyState";
import RowActions from "../../components/common/RowActions";

import {
  getListBean,
  getCiterneById,
  deleteCiterne,
} from "../../services/citerneService";

import type {
  Citerne as CiterneApi,
} from "../../models/citerne.model";

// ==========================================
// TYPE FRONTEND
// ==========================================

type CiterneUI = Citerne & {
  citerneId?: number;
};

// ==========================================
// CONVERSION BACKEND -> FRONTEND
// ==========================================

const mapApiCiterne = (item: CiterneApi): CiterneUI => {
  if (item.id == null || !Number.isFinite(Number(item.id))) {
    throw new Error("Identifiant invalide pour une citerne.");
  }

  // dateFabrication est conservée dans l'interface.
  // Elle est récupérée si le backend la renvoie.
  const itemWithDate = item as CiterneApi & {
    dateFabrication?: string;
  };

  return {
    id: Number(item.id),
    citerneId: item.citerneId,
    reference: item.reference ?? "",
    name: item.libelle ?? "",
    capacite: Number(item.capacity ?? 0),
    dateFabrication: itemWithDate.dateFabrication ?? "",
  };
};

// ==========================================
// PAGE CONSULTATION DES CITERNES
// ==========================================

export default function CiternesPage() {
  // ==========================================
  // ÉTATS
  // ==========================================

  const [citernes, setCiternes] = useState<CiterneUI[]>([]);
  const [filteredCiternes, setFilteredCiternes] =
    useState<CiterneUI[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [selectedCiterne, setSelectedCiterne] =
    useState<CiterneUI | null>(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================
  // CHARGER LES CITERNES
  // GET /citerne/getListBean
  // ==========================================

  const fetchCiternes = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getListBean();

      const result = data.map(mapApiCiterne);

      setCiternes(result);
      setFilteredCiternes(result);
    } catch (error) {
      console.error("Erreur chargement des citernes :", error);

      setErrorMessage(
        "Impossible de récupérer les citernes depuis le serveur."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // CHARGEMENT INITIAL
  // ==========================================

  useEffect(() => {
    fetchCiternes();
  }, [fetchCiternes]);

  // ==========================================
  // FILTRES DES CITERNES
  // ==========================================

  const citerneFilters: FilterField[] = useMemo(() => {
    const capacities = [
      ...new Set(citernes.map((citerne) => citerne.capacite)),
    ].sort((a, b) => a - b);

    return [
      {
        type: "search",
        name: "reference",
        label: "Référence",
        placeholder: "Rechercher par référence...",
      },
      {
        type: "select",
        name: "capacite",
        label: "Capacité (L)",
        placeholder: "Toutes les capacités",
        icon: Layers,
        options: capacities.map((capacite) => ({
          label: `${capacite.toLocaleString("fr-FR")} L`,
          value: String(capacite),
        })),
      },
    ];
  }, [citernes]);

  // ==========================================
  // OUVRIR LE FORMULAIRE D'AJOUT
  // ==========================================

  const handleAdd = () => {
    setSelectedCiterne(null);
    setIsFormOpen(true);
  };

  // ==========================================
  // OUVRIR LE FORMULAIRE DE MODIFICATION
  // GET /citerne/getId/{id}
  // ==========================================

  const handleEdit = async (citerne: CiterneUI) => {
    try {
      setActionLoading(true);
      setErrorMessage("");

      const data = await getCiterneById(citerne.id);
      const mappedCiterne = mapApiCiterne(data);

      setSelectedCiterne(mappedCiterne);
      setIsFormOpen(true);
    } catch (error) {
      console.error("Erreur récupération de la citerne :", error);

      setErrorMessage(
        "Impossible de récupérer les informations de cette citerne."
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
    setSelectedCiterne(null);
  };

  // ==========================================
  // ENREGISTRER : AJOUT / MODIFICATION
  // POST /citerne/save
  // POST /citerne/update
  // ==========================================

  // ==========================================
// ACTUALISER LA LISTE APRÈS ENREGISTREMENT
// ==========================================

const handleSave = async (_values: FormValues) => {
  await fetchCiternes();
  handleCancel();
};

  // ==========================================
  // SUPPRIMER UNE CITERNE
  // POST /citerne/delete/{id}
  // ==========================================

  const handleDelete = async (citerne: CiterneUI) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la citerne "${citerne.reference}" ?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setErrorMessage("");

      await deleteCiterne(citerne.id);

      // Actualiser la liste depuis le backend
      await fetchCiternes();
    } catch (error) {
      console.error("Erreur suppression citerne :", error);

      setErrorMessage(
        "Impossible de supprimer cette citerne."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // APPLIQUER LES FILTRES
  // ==========================================

  const handleFilter = (filters: FilterValues) => {
    const result = citernes.filter((citerne) => {
      const matchesReference =
        !filters.reference ||
        citerne.reference
          .toLowerCase()
          .includes(String(filters.reference).toLowerCase());

      const matchesCapacity =
        !filters.capacite ||
        citerne.capacite === Number(filters.capacite);

      return matchesReference && matchesCapacity;
    });

    setFilteredCiternes(result);
  };

  // ==========================================
  // RÉINITIALISER LES FILTRES
  // ==========================================

  const handleReset = () => {
    setFilteredCiternes(citernes);
  };

  // ==========================================
  // AFFICHAGE DU FORMULAIRE
  // ==========================================

  if (isFormOpen) {
    return (
      <div className="mx-auto w-full max-w-[1450px] space-y-4">
        <AjouterModifierPage
          citerne={selectedCiterne}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        {actionLoading && (
          <p className="text-sm text-gray-500">
            Enregistrement en cours...
          </p>
        )}

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
  // COLONNES DU TABLEAU
  // ==========================================

  const citerneColumns: TableColumn<CiterneUI>[] = [
    {
      key: "reference",
      title: "Référence",
      className: "whitespace-nowrap font-semibold text-[#38453D]",
    },
    {
      key: "name",
      title: "Nom de la citerne",
      className: "min-w-[170px]",
    },
    {
      key: "capacite",
      title: "Capacité",
      align: "right",
      className: "whitespace-nowrap font-semibold text-[#46534B]",
      render: (row) =>
        `${row.capacite.toLocaleString("fr-FR")} L`,
    },
    {
      key: "dateFabrication",
      title: "Date de fabrication",
      className: "whitespace-nowrap",
      render: (row) => (
        <DateTimeDisplay value={row.dateFabrication} />
      ),
    },
    {
      key: "edit",
      title: "Modifier",
      render: (row) => (
        <RowActions
          type="edit"
          onClick={() => handleEdit(row)}
        />
      ),
    },
    {
      key: "delete",
      title: "Supprimer",
      render: (row) => (
        <RowActions
          type="delete"
          onClick={() => handleDelete(row)}
        />
      ),
    },
  ];

  // ==========================================
  // AFFICHAGE DE LA PAGE CITERNES
  // ==========================================

  return (
    <div className="mx-auto w-full max-w-[1450px] space-y-3 sm:space-y-4">

      {/* PAGE HEADER */}

      <PageHeader
        title="Liste des citernes"
        description="Consultez et gérez les différentes citernes."
        addLabel="Ajouter une citerne"
        onAdd={handleAdd}
      />

      {/* FILTRES */}

      <FilterPanel
        title="Filtres - Citernes"
        icon={<Droplets size={18} />}
        fields={citerneFilters}
        onApply={handleFilter}
        onReset={handleReset}
      />

      {/* MESSAGE D'ERREUR */}

      {errorMessage && (
        <p className="text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      {/* TABLEAU DES CITERNES */}

      <Card padding="md">
        <div className="mt-4">

          {loading ? (
            <div className="py-8 text-center text-gray-500">
              Chargement des citernes...
            </div>
          ) : filteredCiternes.length > 0 ? (

            <Pagination
              key={filteredCiternes
                .map((item) => item.id)
                .join("-")}
              data={filteredCiternes}
              pageSize={7}
            >
              {(paginatedCiternes) => (
                <DataTableSection
                  title="Citernes"
                  badgeLabel={`${filteredCiternes.length} citernes`}
                  data={paginatedCiternes}
                  columns={citerneColumns}
                  getRowKey={(row) => row.id}
                  minWidth="700px"
                />
              )}
            </Pagination>

          ) : (

            <EmptyState
              icon={<ReceiptText size={30} />}
              title="Aucune citerne trouvée"
              description={
                citernes.length === 0
                  ? "Aucune citerne n'est disponible."
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
