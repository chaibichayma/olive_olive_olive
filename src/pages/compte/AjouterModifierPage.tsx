

import { useMemo, useState } from "react";
import { Wallet } from "lucide-react";

import { FormPageLayout } from "../../components/forms";
import type {
  FormSection,
  FormValues,
} from "../../components/forms";

import type { Compte } from "./types/compte.types";
import { comptesData } from "./data/compte.data";


import DataTableSection from "../../components/tables/DataTableSection";
import EmptyState from "../../components/common/EmptyState";
import type { TableColumn } from "../../components/tables";
import type { BonReception } from "../traitementBase/types/traitement.types";
import { bonsReceptionData } from "../traitementBase/data/traitement.data";

// ==========================================
// PROPRIÉTÉS
// ==========================================

interface AjouterModifierPageProps {
  compte?: Compte | null;
  onSave: (values: FormValues) => void;
  onCancel: () => void;
}

// ==========================================
// FORMATAGE
// ==========================================

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
  }).format(value);

const formatCurrency = (value: number) =>
  `${formatNumber(value)} DT`;

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR");

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

  // ==========================================
  // COMPTE TROUVÉ
  // ==========================================

  const [matchedCompte, setMatchedCompte] = useState<Compte | null>(
    () => compte ?? null
  );

  // En modification, conserver le compte concerné.
  // En ajout, utiliser le compte trouvé par téléphone.
  const activeCompte = isEditing ? compte : matchedCompte;

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
  // RECHERCHE DU COMPTE PAR TÉLÉPHONE
  // ==========================================

  const handleValuesChange = (
    values: FormValues
  ): FormValues | void => {
    // En modification, on conserve le compte actuel.
    if (isEditing) return;

    const phone = (values.mobile ?? "").replace(/\s/g, "");

    if (!phone) {
      setMatchedCompte(null);
      return;
    }

    const foundCompte = comptesData.find(
      (item) =>
        item.mobile.replace(/\s/g, "") === phone
    );

    setMatchedCompte(foundCompte ?? null);

    // Aucun compte trouvé : ne rien afficher automatiquement.
    if (!foundCompte) return;

    // Remplir automatiquement les informations du compte.
    return {
      image: foundCompte.image ?? "",
      name: foundCompte.name,
      mobile: foundCompte.mobile,
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
  };

  // ==========================================
  // HISTORIQUE DES BONS DE RÉCEPTION
  // ==========================================

  const bonsDuCompte = useMemo(() => {
    if (!activeCompte) return [];

    return bonsReceptionData.filter(
      (bon) =>
        bon.compteId.toString() === activeCompte.id.toString()
    );
  }, [activeCompte]);

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
        // IMAGE À GAUCHE : 4 LIGNES

        {
          name: "image",
          label: "Photo du compte",
          type: "image",
          accept: "image/png,image/jpeg,image/webp",
          rowSpan: 4,
        },

        // LIGNE 1

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

        // LIGNE 2

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

        // LIGNE 3

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

        // LIGNE 4

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
        compte
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

            {bonsDuCompte.length === 0 && (
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
  );
}
