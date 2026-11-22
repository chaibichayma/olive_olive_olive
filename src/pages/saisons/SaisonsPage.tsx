
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Layers,
  ReceiptText,
} from "lucide-react";

import { Card, Badge } from "../../components/ui";
import { PageHeader } from "../../components/common";

import type { Saison } from "./types/saison.types";

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
  getSaisonById,
  deleteSaison,
} from "../../services/saisonService";

// ==========================================
// PAGE CONSULTATION DES SAISONS
// ==========================================

export default function SaisonsPage() {

  // ==========================================
  // ÉTATS
  // ==========================================

  const [saisons, setSaisons] = useState<Saison[]>([]);
  const [filteredSaisons, setFilteredSaisons] = useState<Saison[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSaison, setSelectedSaison] = useState<Saison | null>(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================
  // RÉCUPÉRER LES SAISONS DEPUIS LE BACKEND
  // GET /season/getListBean
  // ==========================================

  const fetchSaisons = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getListBean();

      // Adaptation au type Saison utilisé par la page
      const result = data as unknown as Saison[];

      setSaisons(result);
      setFilteredSaisons(result);

    } catch (error) {
      console.error("Erreur chargement des saisons :", error);
      setErrorMessage(
        "Impossible de récupérer les saisons depuis le serveur."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // CHARGEMENT INITIAL
  // ==========================================

  useEffect(() => {
    fetchSaisons();
  }, [fetchSaisons]);

  // ==========================================
  // FILTRES DES SAISONS
  // ==========================================

  const saisonFilters: FilterField[] = useMemo(
    () => [
      {
        type: "select",
        name: "year",
        label: "Année",
        placeholder: "Toutes les années",
        icon: CalendarDays,
        options: [
          ...new Set(
            saisons.map((saison) => saison.year)
          ),
        ]
          .filter((year) => year != null)
          .sort((a, b) => Number(b) - Number(a))
          .map((year) => ({
            label: String(year),
            value: String(year),
          })),
      },
      {
        type: "date",
        name: "beginDate",
        label: "Date début",
      },
      {
        type: "date",
        name: "endDate",
        label: "Date fin",
      },
      {
        type: "select",
        name: "statusId",
        label: "Statut",
        placeholder: "Tous les statuts",
        icon: Layers,
        options: [
          { label: "En cours", value: "1" },
          { label: "Clôturée", value: "2" },
        ],
      },
    ],
    [saisons]
  );

  // ==========================================
  // STATUT DE LA SAISON
  // ==========================================

  function getStatusVariant(statusId: number) {
    switch (statusId) {
      case 1:
        return "success" as const;
      case 2:
        return "neutral" as const;
      default:
        return "neutral" as const;
    }
  }

  // ==========================================
  // OUVRIR LE FORMULAIRE D'AJOUT
  // ==========================================

  const handleAdd = () => {
    setSelectedSaison(null);
    setIsFormOpen(true);
  };

  // ==========================================
  // OUVRIR LE FORMULAIRE DE MODIFICATION
  // GET /season/getId/{id}
  // ==========================================

  const handleEdit = async (saison: Saison) => {
    try {
      setActionLoading(true);
      setErrorMessage("");

      const data = await getSaisonById(Number(saison.id));

      setSelectedSaison(data as unknown as Saison);
      setIsFormOpen(true);

    } catch (error) {
      console.error("Erreur récupération de la saison :", error);
      setErrorMessage(
        "Impossible de récupérer les informations de cette saison."
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
    setSelectedSaison(null);
    setErrorMessage("");
  };

  // ==========================================
  // ENREGISTRER : AJOUT / MODIFICATION
  // Les API sont appelées dans AjouterModifierPage
  // ==========================================

  const handleSave = async (_values: FormValues) => {
    // L'ajout ou la modification a déjà réussi
    // dans AjouterModifierPage.
    // On recharge les données depuis le backend.

    await fetchSaisons();

    setIsFormOpen(false);
    setSelectedSaison(null);
  };

  // ==========================================
  // SUPPRIMER UNE SAISON
  // POST /season/delete/{id}
  // ==========================================

  

const handleDelete = async (saison: Saison) => {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer la saison "${saison.year}" ?`
  );

  if (!confirmed) return;

  try {
    setActionLoading(true);
    setErrorMessage("");

    // Récupérer l'identifiant réel
    const id = Number(saison.id);

    console.log("Saison sélectionnée :", saison);
    console.log("ID envoyé pour suppression :", id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Identifiant de saison invalide.");
    }

    // Suppression par ID
    await deleteSaison(id);

    // Actualiser la liste
    await fetchSaisons();

  } catch (error) {
    console.error("Erreur suppression de la saison :", error);

    setErrorMessage(
      "Impossible de supprimer cette saison. Veuillez réessayer."
    );
  } finally {
    setActionLoading(false);
  }
};



  // ==========================================
  // APPLIQUER LES FILTRES
  // ==========================================

  const handleFilter = (filters: FilterValues) => {
    const result = saisons.filter((saison) => {

      // Filtre par année
      const matchesYear =
        !filters.year ||
        saison.year === Number(filters.year);

      // Filtre par date début
      const matchesBeginDate =
        !filters.beginDate ||
        saison.beginDate >= filters.beginDate;

      // Filtre par date fin
      const matchesEndDate =
        !filters.endDate ||
        saison.endDate <= filters.endDate;

      // Filtre par statut
      const matchesStatus =
        !filters.statusId ||
        saison.statusId === Number(filters.statusId);

      return (
        matchesYear &&
        matchesBeginDate &&
        matchesEndDate &&
        matchesStatus
      );
    });

    setFilteredSaisons(result);
  };

  // ==========================================
  // RÉINITIALISER LES FILTRES
  // ==========================================

  const handleReset = () => {
    setFilteredSaisons(saisons);
  };

  // ==========================================
  // AFFICHAGE DU FORMULAIRE
  // ==========================================

  if (isFormOpen) {
    return (
      <div className="mx-auto w-full max-w-[1450px] space-y-4">

        <AjouterModifierPage
          saison={selectedSaison}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        <Footer />

      </div>
    );
  }

  // ==========================================
  // COLONNES DU TABLEAU DES SAISONS
  // ==========================================

  const saisonColumns: TableColumn<Saison>[] = [
    {
      key: "year",
      title: "Année",
      className: "whitespace-nowrap font-semibold text-[#38453D]",
    },
    {
      key: "beginDate",
      title: "Date début",
      className: "whitespace-nowrap",
      render: (row) => (
        <DateTimeDisplay value={row.beginDate} />
      ),
    },
    {
      key: "endDate",
      title: "Date fin",
      className: "whitespace-nowrap",
      render: (row) => (
        <DateTimeDisplay value={row.endDate} />
      ),
    },
    {
      key: "priceKilo",
      title: "Prix / Kg olives",
      align: "right",
      className: "whitespace-nowrap font-semibold text-[#46534B]",
      render: (row) => `${Number(row.priceKilo).toFixed(3)} DT`,
    },
    {
      key: "priceAchat",
      title: "Prix achat / L",
      align: "right",
      className: "whitespace-nowrap",
      render: (row) => `${Number(row.priceAchat).toFixed(3)} DT`,
    },
    {
      key: "priceVente",
      title: "Prix vente / L",
      align: "right",
      className: "whitespace-nowrap",
      render: (row) => `${Number(row.priceVente).toFixed(3)} DT`,
    },
    {
      key: "nbreCaisses",
      title: "Nombre de caisses",
      align: "right",
      className: "whitespace-nowrap",
    },
    {
      key: "statusId",
      title: "Statut",
      render: (row) => (
        <Badge variant={getStatusVariant(row.statusId)}>
          {row.statusId === 1
            ? "En cours"
            : row.statusId === 2
              ? "Clôturée"
              : "Inconnu"}
        </Badge>
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
  // AFFICHAGE DE LA PAGE SAISONS
  // ==========================================

  return (
    <div className="mx-auto w-full max-w-[1450px] space-y-3 sm:space-y-4">

      {/* PAGE HEADER */}

      <PageHeader
        title="Liste des saisons"
        description="Consultez et gérez les différentes saisons."
        addLabel="Ajouter une saison"
        onAdd={handleAdd}
      />

      {/* ERREUR */}

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      {/* CHARGEMENT */}

      {(loading || actionLoading) && (
        <div className="rounded-lg border border-[#E7ECE9] bg-white p-4 text-sm text-[#47785B] dark:border-[#35463B] dark:bg-[#1C2921] dark:text-[#91C5A1]">
          Chargement en cours...
        </div>
      )}

      {/* FILTRES */}

      <FilterPanel
        title="Filtres - Saisons"
        icon={<CalendarDays size={18} />}
        fields={saisonFilters}
        onApply={handleFilter}
        onReset={handleReset}
      />

      {/* TABLEAU DES SAISONS */}

      <Card padding="md">
        <div className="mt-4">

          {loading ? (
            <div className="py-10 text-center text-sm text-[#89948C] dark:text-[#A8B8AC]">
              Chargement des saisons...
            </div>
          ) : filteredSaisons.length > 0 ? (
            <Pagination
              key={filteredSaisons.map((item) => item.id).join("-")}
              data={filteredSaisons}
              pageSize={7}
            >
              {(paginatedSaisons) => (
                <DataTableSection
                  title="Saisons"
                  badgeLabel={`${filteredSaisons.length} saisons`}
                  data={paginatedSaisons}
                  columns={saisonColumns}
                  getRowKey={(row) => row.id}
                  minWidth="1100px"
                />
              )}
            </Pagination>
          ) : (
            <EmptyState
              icon={<ReceiptText size={30} />}
              title="Aucune saison trouvée"
              description={
                saisons.length === 0
                  ? "Aucune saison n'est disponible pour le moment."
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
