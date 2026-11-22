
import { useEffect, useState } from "react";
import { ReceiptText } from "lucide-react";

import { FormPageLayout } from "../../components/forms";
import type {
  FormValues,
  FormSection,
} from "../../components/forms";

import type { BonReception } from "./types/bonReception.types";

import CaisseSelector from "../../components/bonReception/CaisseSelector";
import CompteHistory from "../../components/bonReception/CompteHistory";

import {
  getComptesBase,
  getCompteByPhone,
  createBonReception,
} from "../../services/bonReceptionService";

import type { BonReceptionRequest } from "../../models/bonReception.model";

// ==========================================
// TYPES DES COMPTES
// ==========================================

interface CompteOption {
  id: number;
  name: string;
  mobile: string;
  isBaseCompte: boolean;
}

// ==========================================
// PROPS
// ==========================================

interface AjouterModifierPageProps {
  bonReception?: BonReception | null;
  onSave: (values: FormValues) => void | Promise<void>;
  onCancel: () => void;
}

// ==========================================
// FORMATAGE DES DATES
// ==========================================

const formatDateTimeLocal = (
  value?: string | null
): string => {
  if (!value) return "";
  return value.slice(0, 16);
};

const convertDateToISO = (
  value?: string
): string | undefined => {
  if (!value) return undefined;

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? undefined
    : date.toISOString();
};

// ==========================================
// FORMATAGE DES CAISSES
// ==========================================

const formatCaisses = (value?: string | null): string[] => {
  if (!value) return [];

  return value
    .split(",")
    .map((caisse) => caisse.trim())
    .filter(Boolean);
};

// ==========================================
// CONVERSION DES NOMBRES
// ==========================================

const toNumber = (
  value: unknown
): number | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : undefined;
};

// ==========================================
// VALEURS INITIALES
// ==========================================

const initialValues = (
  bonReception?: BonReception | null
): FormValues => ({
  reference: bonReception?.reference ?? "",
  compteId: bonReception?.compteId?.toString() ?? "",

  name: bonReception?.name ?? "",
  mobile: bonReception?.mobile ?? "",

  quantityOil: bonReception?.quantityOil?.toString() ?? "",
  quantityOlive: bonReception?.quantityOlive?.toString() ?? "",

  priceKg: bonReception?.priceKg?.toString() ?? "",
  price: bonReception?.price?.toString() ?? "",
  payement: bonReception?.payement?.toString() ?? "",
  acompte: bonReception?.acompte?.toString() ?? "",
  priceOil: bonReception?.priceOil?.toString() ?? "",

  statusId: bonReception?.statusId ?? "",
  statusLib: bonReception?.statusLib ?? "",

  caisse: bonReception?.caisse ?? "",
  natureId: bonReception?.natureId?.toString() ?? "",
  typeHuile: bonReception?.typeHuile?.toString() ?? "",

  isBaseCompte:
    bonReception?.isBaseCompte === undefined
      ? "true"
      : bonReception.isBaseCompte.toString(),

  observation: bonReception?.observation ?? "",

  dateCreation: formatDateTimeLocal(bonReception?.dateCreation),
  dateDebProduction: formatDateTimeLocal(
    bonReception?.dateDebProduction
  ),
  dateFinProduction: formatDateTimeLocal(
    bonReception?.dateFinProduction
  ),
});

// ==========================================
// PAGE AJOUTER / MODIFIER
// ==========================================

export default function AjouterModifierPage({
  bonReception,
  onSave,
  onCancel,
}: AjouterModifierPageProps) {
  const isEditing = Boolean(bonReception);

  // ==========================================
  // ÉTATS
  // ==========================================

  const [formInitialValues, setFormInitialValues] =
    useState<FormValues>(() => initialValues(bonReception));

  const [comptes, setComptes] = useState<CompteOption[]>([]);

  const [matchedCompte, setMatchedCompte] =
    useState<CompteOption | null>(null);

  const [selectedCaisses, setSelectedCaisses] = useState<string[]>(
    () => formatCaisses(bonReception?.caisse)
  );

  const [loading, setLoading] = useState(false);
  const [loadingComptes, setLoadingComptes] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================
  // RÉCUPÉRER LES COMPTES DE BASE
  // GET /reception/doCompteBaseFilter
  // ==========================================

  useEffect(() => {
    const fetchComptes = async () => {
      try {
        setLoadingComptes(true);

        const response = await getComptesBase();

        const result: CompteOption[] = (Array.isArray(response)
          ? response
          : []
        ).map((item: any) => ({
          id: Number(item.id),
          name: item.name ?? item.libelle ?? "",
          mobile: item.mobile ?? "",
          isBaseCompte: Boolean(item.isBaseCompte),
        })).filter((item: CompteOption) =>
          Number.isFinite(item.id) && item.id > 0
        );

        setComptes(result);

        const selected = result.find(
          (item) =>
            item.id.toString() ===
            bonReception?.compteId?.toString()
        );

        if (selected) {
          setMatchedCompte(selected);
        }
      } catch (error) {
        console.error("Erreur chargement des comptes :", error);
        setErrorMessage(
          "Impossible de récupérer les comptes de base."
        );
      } finally {
        setLoadingComptes(false);
      }
    };

    fetchComptes();
  }, [bonReception]);

  // ==========================================
  // SYNCHRONISATION
  // ==========================================

  useEffect(() => {
    setFormInitialValues(initialValues(bonReception));

    setSelectedCaisses(formatCaisses(bonReception?.caisse));

    setErrorMessage("");
  }, [bonReception]);

  // ==========================================
  // RECHERCHE DU COMPTE PAR TÉLÉPHONE
  // GET /reception/getCompte?phone=...
  // ==========================================

  const handleValuesChange = (
    values: FormValues
  ): FormValues | void => {
    const phone = String(values.mobile ?? "").replace(/\s/g, "");

    if (!phone) {
      setMatchedCompte(null);
      return {
        compteId: "",
      };
    }

    // Recherche dans les comptes déjà chargés
    const compteLocal = comptes.find(
      (item) =>
        item.mobile.replace(/\s/g, "") === phone
    );

    if (compteLocal) {
      setMatchedCompte(compteLocal);

      return {
        compteId: compteLocal.id.toString(),
        name: compteLocal.name,
        mobile: compteLocal.mobile,
        isBaseCompte: compteLocal.isBaseCompte.toString(),
      };
    }

    // Recherche auprès du backend
    if (phone.length >= 8) {
      getCompteByPhone(phone)
        .then((response: any) => {
          const item = Array.isArray(response)
            ? response[0]
            : response;

          if (!item) {
            setMatchedCompte(null);
            return;
          }

          const compte: CompteOption = {
            id: Number(item.id),
            name: item.name ?? item.libelle ?? "",
            mobile: item.mobile ?? phone,
            isBaseCompte: Boolean(item.isBaseCompte),
          };

          if (Number.isFinite(compte.id) && compte.id > 0) {
            setMatchedCompte(compte);
          }
        })
        .catch((error) => {
          console.error("Erreur recherche du compte :", error);
        });
    }
  };

  // ==========================================
  // SECTIONS DU FORMULAIRE
  // ==========================================

  const sections: FormSection[] = [
    {
      title: "Informations du bon de réception",
      description:
        "Informations générales, production, financières et dates de réception.",
      icon: <ReceiptText size={17} />,
      columns: 2,

      fields: [
        {
          name: "reference",
          label: "Référence",
          type: "text",
          placeholder: "Ex : BR-2026-001",
          required: true,
        },
        {
          name: "compteId",
          label: "Compte",
          type: "select",
          placeholder: loadingComptes
            ? "Chargement des comptes..."
            : "Sélectionner un compte",
          required: true,
          options: comptes.map((compte) => ({
            label: compte.name,
            value: compte.id.toString(),
          })),
        },
        {
          name: "name",
          label: "Nom du client",
          type: "text",
          placeholder: "Nom du client",
        },
        {
          name: "mobile",
          label: "Téléphone",
          type: "text",
          placeholder: "Numéro de téléphone",
        },
        {
          name: "quantityOlive",
          label: "Quantité d'olives (kg)",
          type: "number",
          placeholder: "0.000",
        },
        {
          name: "quantityOil",
          label: "Quantité d'huile obtenue",
          type: "number",
          placeholder: "0.000",
        },
        {
          name: "price",
          label: "Prix total",
          type: "number",
          placeholder: "0.000",
        },
        {
          name: "payement",
          label: "Paiement",
          type: "number",
          placeholder: "0.000",
        },
        {
          name: "dateDebProduction",
          label: "Début de production",
          type: "datetime-local",
        },
        {
          name: "dateFinProduction",
          label: "Fin de production",
          type: "datetime-local",
        },
      ],
    },
  ];

  // ==========================================
  // CONTENU SUPPLÉMENTAIRE
  // ==========================================

  const extraContent = (
    <div className="space-y-4">

      {(isEditing || matchedCompte !== null) && (
        <CompteHistory />
      )}

      <CaisseSelector
        selectedCaisses={selectedCaisses}
        onChange={setSelectedCaisses}
      />

    </div>
  );

  // ==========================================
  // ENREGISTRER UN BON DE RÉCEPTION
  // POST /reception/create
  // ==========================================

  const handleSubmit = async (values: FormValues) => {
    if (loading) return;

    setErrorMessage("");

    try {
      setLoading(true);

      // La modification nécessite un endpoint update
      // qui n'a pas encore été identifié dans Swagger.
      if (isEditing) {
        setErrorMessage(
          "La modification nécessite l'endpoint update du backend. Il n'a pas encore été identifié dans Swagger."
        );
        return;
      }

      const compteId = toNumber(values.compteId);

      if (!compteId) {
        setErrorMessage("Veuillez sélectionner un compte.");
        return;
      }

      if (!String(values.reference ?? "").trim()) {
        setErrorMessage("Veuillez saisir la référence du bon.");
        return;
      }

      const data: BonReceptionRequest = {
        reference: String(values.reference ?? "").trim(),
        compteId,

        name: String(values.name ?? "").trim(),
        mobile: String(values.mobile ?? "").trim(),

        quantityOlive: toNumber(values.quantityOlive),
        quantityOil: toNumber(values.quantityOil),

        priceKg: toNumber(values.priceKg),
        price: toNumber(values.price),
        payement: toNumber(values.payement),
        acompte: toNumber(values.acompte),
        priceOil: toNumber(values.priceOil),

        statusId: String(values.statusId ?? ""),
        statusLib: String(values.statusLib ?? ""),

        caisse: selectedCaisses.join(","),

        natureId: toNumber(values.natureId),
        typeHuile: toNumber(values.typeHuile),

        isBaseCompte: values.isBaseCompte === "true",

        observation: String(values.observation ?? ""),

        dateCreation: convertDateToISO(
          String(values.dateCreation ?? "")
        ),
        dateDebProduction: convertDateToISO(
          String(values.dateDebProduction ?? "")
        ),
        dateFinProduction: convertDateToISO(
          String(values.dateFinProduction ?? "")
        ),
      };

      // Création via API
      await createBonReception(data);

      console.log("Bon de réception créé avec succès.");

      // Actualiser la liste dans la page parent
      await onSave({
        ...values,
        caisse: selectedCaisses.join(","),
      });

    } catch (error: any) {
      console.error("Erreur création du bon :", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      setErrorMessage(
        error.response?.data?.message ??
          "Une erreur est survenue lors de la création du bon de réception."
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
          isEditing
            ? "Modifier le bon de réception"
            : "Ajouter un bon de réception"
        }
        description={
          isEditing
            ? "Modifier les informations du bon de réception."
            : "Remplir les informations pour créer un nouveau bon de réception."
        }
        icon={<ReceiptText size={20} />}
        sections={sections}
        initialValues={formInitialValues}
        onValuesChange={handleValuesChange}
        extraContent={extraContent}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        submitLabel={
          loading
            ? "Enregistrement..."
            : isEditing
              ? "Enregistrer les modifications"
              : "Ajouter"
        }
      />
    </div>
  );
}
