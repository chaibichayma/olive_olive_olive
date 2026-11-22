
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Wallet } from "lucide-react";

import { FormPageLayout } from "../../components/forms";
import type {
  FormSection,
  FormValues,
} from "../../components/forms";

import type { Compte } from "./types/compte.types";

import DataTableSection from "../../components/tables/DataTableSection";
import EmptyState from "../../components/common/EmptyState";
import type { TableColumn } from "../../components/tables";
import type { BonReception } from "../traitementBase/types/traitement.types";

import {
  saveCompte,
  updateCompte,
} from "../../services/compteService";

import {
  getCompteByPhone,
  getListBean,
} from "../../services/bonReceptionService";

import type { CompteRequest } from "../../models/compte.model";

// ==========================================
// PROPRIÉTÉS
// ==========================================

interface AjouterModifierPageProps {
  compte?: Compte | null;
  onSave: (values: FormValues) => void | Promise<void>;
  onCancel: () => void;
}

// ==========================================
// FORMATAGE
// ==========================================

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
  }).format(value ?? 0);

const formatCurrency = (value: number) =>
  `${formatNumber(value)} DT`;

const formatDate = (date: string) =>
  date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR")
    : "—";

const normalizePhone = (phone?: string) =>
  (phone ?? "").replace(/\s/g, "").trim();

// ==========================================
// EXTRACTION DU COMPTE BACKEND
// ==========================================

const extractCompte = (response: unknown): Compte | null => {
  if (!response || typeof response !== "object") return null;

  let data: unknown = response;

  if (Array.isArray(data)) {
    data = data[0];
  }

  if (!data || typeof data !== "object") return null;

  const wrapper = data as Record<string, unknown>;

  data = wrapper.compte ?? wrapper.data ?? data;

  if (Array.isArray(data)) {
    data = data[0];
  }

  if (!data || typeof data !== "object") return null;

  const item = data as Record<string, unknown>;
  const id = Number(item.id ?? item.compteId);

  if (!Number.isFinite(id) || id <= 0) return null;

  return {
    ...item,
    id,
    name: String(item.name ?? ""),
    mobile: String(item.mobile ?? ""),
    mail: String(item.mail ?? ""),
    adresse: String(item.adresse ?? ""),
    image: String(item.image ?? ""),
    statusId: Number(item.statusId ?? 1),
    isBaseCompte:
      item.isBaseCompte === true ||
      item.isBaseCompte === "true" ||
      item.isBaseCompte === "1",
    priceConv: Number(item.priceConv ?? 0),
    baseCompteId:
      item.baseCompteId != null
        ? Number(item.baseCompteId)
        : undefined,
  } as unknown as Compte;
};

// ==========================================
// EXTRACTION DES BONS BACKEND
// ==========================================

const extractBons = (response: unknown): BonReception[] => {
  if (Array.isArray(response)) {
    return response as BonReception[];
  }

  if (response && typeof response === "object") {
    const result = response as Record<string, unknown>;
    const data = result.data ?? result.bons;

    if (Array.isArray(data)) {
      return data as BonReception[];
    }
  }

  return [];
};

// ==========================================
// COLONNES DES BONS DE RÉCEPTION
// ==========================================

const bonColumns: TableColumn<BonReception>[] = [
  {
    key: "reference",
    title: "Référence",
    render: (row) => (
      <span className="font-semibold text-[#285640] dark:text-[#91C5A1]">
        {row.reference}
      </span>
    ),
  },
  {
    key: "date",
    title: "Date",
    render: (row) => formatDate(row.date),
  },
  {
    key: "quantiteOlives",
    title: "Quantité olives",
    align: "right",
    render: (row) => `${formatNumber(row.quantiteOlives)} kg`,
  },
  {
    key: "quantiteHuile",
    title: "Quantité huile",
    align: "right",
    render: (row) => `${formatNumber(row.quantiteHuile)} L`,
  },
  {
    key: "rendement",
    title: "Rendement",
    align: "right",
    render: (row) => `${formatNumber(row.rendement)} %`,
  },
  {
    key: "montantTotal",
    title: "Montant total",
    align: "right",
    render: (row) => formatCurrency(row.montantTotal),
  },
  {
    key: "resteAPayer",
    title: "Reste à payer",
    align: "right",
    render: (row) => (
      <span
        className={
          row.resteAPayer > 0
            ? "font-semibold text-[14px] text-[#C17A36] dark:text-[#E5B477]"
            : "font-semibold text-[14px] text-[#47785B] dark:text-[#91C5A1]"
        }
      >
        {formatCurrency(row.resteAPayer)}
      </span>
    ),
  },
  {
    key: "statut",
    title: "Statut",
    render: (row) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[13px] font-semibold ${
          row.statut === "Payé"
            ? "bg-[#EDF5EF] text-[#285640] dark:bg-[#294536] dark:text-[#B9DEC4]"
            : row.statut === "En attente"
              ? "bg-[#FFF5E8] text-[#B77932] dark:bg-[#493923] dark:text-[#E5B477]"
              : "bg-[#EEF2F8] text-[#55749A] dark:bg-[#2B3B50] dark:text-[#A9C4E3]"
        }`}
      >
        {row.statut}
      </span>
    ),
  },
];

// ==========================================
// AJOUT / MODIFICATION D'UN COMPTE
// ==========================================

export default function AjouterModifierPage({
  compte,
  onSave,
  onCancel,
}: AjouterModifierPageProps) {
  const isEditing = Boolean(compte);

  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingBons, setLoadingBons] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Compte actuellement reconnu par le backend
  const [matchedCompte, setMatchedCompte] = useState<Compte | null>(
    () => compte ?? null
  );

  // Bons de réception du compte reconnu
  const [bonsDuCompte, setBonsDuCompte] = useState<BonReception[]>([]);

  // Gestion des recherches successives
  const searchSequence = useRef(0);
  const bonsSequence = useRef(0);
  const lastPhone = useRef(normalizePhone(compte?.mobile));

  // ==========================================
  // COMPTE ACTIF
  // ==========================================

  const activeCompte = matchedCompte;

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
  // RÉCUPÉRER LES BONS DU COMPTE
  // ==========================================

  const loadBonsByCompte = useCallback(async (compteId: number) => {
    const currentRequest = ++bonsSequence.current;

    try {
      setLoadingBons(true);
      setBonsDuCompte([]);

      // GET /reception/getListBean?searche=
      const response = await getListBean("");

      if (currentRequest !== bonsSequence.current) return;

      const allBons = extractBons(response);

      const filteredBons = allBons.filter(
        (bon) => String(bon.compteId) === String(compteId)
      );

      setBonsDuCompte(filteredBons);
    } catch (error) {
      if (currentRequest !== bonsSequence.current) return;

      console.error("Erreur récupération des bons :", error);
      setBonsDuCompte([]);
    } finally {
      if (currentRequest === bonsSequence.current) {
        setLoadingBons(false);
      }
    }
  }, []);

  // ==========================================
  // INITIALISATION EN MODE MODIFICATION
  // ==========================================

  useEffect(() => {
    searchSequence.current++;
    bonsSequence.current++;

    setMatchedCompte(compte ?? null);
    setBonsDuCompte([]);

    lastPhone.current = normalizePhone(compte?.mobile);

    if (compte?.id) {
      loadBonsByCompte(Number(compte.id));
    } else {
      setLoadingBons(false);
    }

    return () => {
      searchSequence.current++;
      bonsSequence.current++;
    };
  }, [compte?.id, loadBonsByCompte]);

  // ==========================================
  // RECHERCHER LE COMPTE PAR TÉLÉPHONE
  // ==========================================

  const handleValuesChange = useCallback(
    async (values: FormValues): Promise<FormValues | void> => {
      const phone = normalizePhone(values.mobile);

      // Éviter les appels si le téléphone n'a pas changé
      if (phone === lastPhone.current) return;

      lastPhone.current = phone;

      // Invalider les recherches précédentes
      const requestId = ++searchSequence.current;

      setErrorMessage("");

      if (!phone) {
        setMatchedCompte(null);
        setBonsDuCompte([]);

        bonsSequence.current++;

        return {
          image: "",
          name: "",
          mail: "",
          adresse: "",
          statusId: "1",
          isBaseCompte: "true",
          priceConv: "",
          baseCompteId: "",
        };
      }

      // Ne rechercher qu'un numéro suffisamment complet
      if (phone.length < 8) {
        setMatchedCompte(null);
        setBonsDuCompte([]);
        bonsSequence.current++;
        return;
      }

      try {
        setLoadingSearch(true);

        // 1. Rechercher le compte par téléphone
        // GET /reception/getCompte?phone=...
        const response = await getCompteByPhone(phone);

        if (requestId !== searchSequence.current) return;

        const foundCompte = extractCompte(response);

        // 2. Si aucun compte n'existe
        if (!foundCompte) {
          setMatchedCompte(null);
          setBonsDuCompte([]);
          bonsSequence.current++;

          return {
            image: "",
            name: "",
            mail: "",
            adresse: "",
            statusId: "1",
            isBaseCompte: "true",
            priceConv: "",
            baseCompteId: "",
          };
        }

        // 3. Afficher le compte trouvé
        setMatchedCompte(foundCompte);

        // 4. Récupérer les bons correspondants
        await loadBonsByCompte(Number(foundCompte.id));

        if (requestId !== searchSequence.current) return;

        // 5. Remplir automatiquement les champs
        return {
          image: foundCompte.image ?? "",
          name: foundCompte.name ?? "",
          mobile: foundCompte.mobile ?? phone,
          mail: foundCompte.mail ?? "",
          adresse: foundCompte.adresse ?? "",
          statusId: String(foundCompte.statusId ?? 1),
          isBaseCompte: String(foundCompte.isBaseCompte ?? true),
          priceConv:
            foundCompte.priceConv != null
              ? String(foundCompte.priceConv)
              : "",
          baseCompteId:
            foundCompte.baseCompteId != null
              ? String(foundCompte.baseCompteId)
              : "",
        };
      } catch (error) {
        if (requestId !== searchSequence.current) return;

        console.error("Erreur recherche compte :", error);

        setMatchedCompte(null);
        setBonsDuCompte([]);
        bonsSequence.current++;

        return {
          name: "",
          mail: "",
          adresse: "",
          image: "",
          statusId: "1",
          isBaseCompte: "true",
          priceConv: "",
          baseCompteId: "",
        };
      } finally {
        if (requestId === searchSequence.current) {
          setLoadingSearch(false);
        }
      }
    },
    [loadBonsByCompte]
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
        {
          name: "image",
          label: "Photo du compte",
          type: "image",
          accept: "image/png,image/jpeg,image/webp",
          rowSpan: 4,
        },
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
  // ENREGISTRER : AJOUT / MODIFICATION
  // ==========================================

  const handleSubmit = async (values: FormValues) => {
    if (loading) return;

    try {
      setLoading(true);
      setErrorMessage("");

      const compteData: CompteRequest = {
        reference: compte?.reference ?? "",
        name: String(values.name ?? "").trim(),
        mobile: String(values.mobile ?? "").trim(),
        priceKg: Number(values.priceConv || 0),
        isBaseCompte: values.isBaseCompte === "true",
      };

      if (!compteData.name || !compteData.mobile) {
        setErrorMessage(
          "Veuillez renseigner le nom et le téléphone du compte."
        );
        return;
      }

      if (
        !Number.isFinite(compteData.priceKg) ||
        compteData.priceKg < 0
      ) {
        setErrorMessage("Le prix de conversion est invalide.");
        return;
      }

      // Éviter de créer un doublon en mode ajout
      if (!isEditing && matchedCompte) {
        setErrorMessage(
          "Ce numéro existe déjà dans la base de données."
        );
        return;
      }

      if (isEditing && compte) {
        await updateCompte({
          ...compteData,
          id: Number(compte.id),
        });
      } else {
        await saveCompte(compteData);
      }

      await onSave(values);
    } catch (error: any) {
      console.error("Erreur enregistrement compte :", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      setErrorMessage(
        error.response?.data?.message ??
          "Une erreur est survenue lors de l'enregistrement du compte."
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

      {loadingSearch && (
        <div className="rounded-xl border border-[#E5EBE6] bg-white px-4 py-3 text-sm text-[#47785B] dark:border-[#35463B] dark:bg-[#1C2921] dark:text-[#91C5A1]">
          Recherche du compte en cours...
        </div>
      )}

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
        onValuesChange={handleValuesChange}
        submitLabel={
          loading
            ? "Enregistrement..."
            : compte
              ? "Enregistrer les modifications"
              : "Ajouter le compte"
        }
        onSubmit={handleSubmit}
        onCancel={onCancel}
        extraContent={
          activeCompte ? (
            <div className="rounded-xl border border-[#E5EBE6] bg-white p-4 sm:p-5 dark:border-[#35463B] dark:bg-[#1C2921]">
              <DataTableSection<BonReception>
                title="Historique des bons de réception"
                data={bonsDuCompte}
                columns={bonColumns}
                getRowKey={(row) => row.id}
                badgeLabel={`${bonsDuCompte.length} bon(s)`}
                minWidth="1100px"
              />

              {loadingBons && (
                <p className="py-3 text-center text-sm text-gray-500">
                  Chargement des bons de réception...
                </p>
              )}

              {!loadingBons && bonsDuCompte.length === 0 && (
                <EmptyState
                  title="Aucun bon de réception"
                  description="Aucun bon de réception trouvé pour ce compte."
                  compact
                />
              )}
            </div>
          ) : null
        }
      />
    </div>
  );
}
