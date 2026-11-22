import api from "../lib/axios";

import type {
  BonReception,
  BonReceptionRequest,
  BonReceptionDeleteResponse,
} from "../models/bonReception.model";


// ==========================================
// RÉCUPÉRER UN BON DE RÉCEPTION PAR ID
// GET /reception/getId/{id}
// ==========================================

export const getBonReceptionById = async (
  id: number
): Promise<BonReception> => {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`Identifiant invalide : ${id}`);
    }

    const response = await api.get<BonReception>(
      `/reception/getId/${id}`
    );

    console.log("Bon de réception récupéré :", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Erreur récupération du bon de réception :",
      error
    );
    throw error;
  }
};

// ==========================================
// RECHERCHER UN COMPTE PAR TÉLÉPHONE
// GET /reception/getCompte?phone=...
// ==========================================

export const getCompteByPhone = async (phone: string) => {
  try {
    if (!phone.trim()) {
      throw new Error("Le numéro de téléphone est obligatoire.");
    }

    const response = await api.get("/reception/getCompte", {
      params: {
        phone: phone.trim(),
      },
    });

    console.log("Compte trouvé par téléphone :", response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur recherche compte par téléphone :", error);
    throw error;
  }
};

// ==========================================
// RÉCUPÉRER LES COMPTES DE BASE
// GET /reception/doCompteBaseFilter
// ==========================================

export const getComptesBase = async (
  searche: string = ""
) => {
  try {
    const response = await api.get(
      "/reception/doCompteBaseFilter",
      {
        params: {
          searche: searche.trim(),
        },
      }
    );

    console.log("Comptes de base récupérés :", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Erreur récupération des comptes de base :",
      error
    );
    throw error;
  }
};

// ==========================================
// RÉCUPÉRER LA LISTE DES BONS DE RÉCEPTION
// GET /reception/getListBean?searche=...
// ==========================================

export const getListBean = async (
  searche: string = ""
): Promise<BonReception[]> => {
  try {
    const response = await api.get<BonReception[]>(
      "/reception/getListBean",
      {
        params: {
          searche: searche.trim(),
        },
      }
    );

    console.log("Liste des bons de réception :", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Erreur récupération des bons de réception :",
      error
    );
    throw error;
  }
};

// ==========================================
// RÉCUPÉRER LES BONS PAR COMPTE DE BASE
// GET /reception/getListBonByCompteBase/{compteId}
// ==========================================

export const getListBonByCompteBase = async (
  compteId: number
): Promise<BonReception[]> => {
  try {
    if (!Number.isInteger(compteId) || compteId <= 0) {
      throw new Error(`Identifiant du compte invalide : ${compteId}`);
    }

    const response = await api.get<BonReception[]>(
      `/reception/getListBonByCompteBase/${compteId}`
    );

    console.log("Bons du compte de base :", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Erreur récupération des bons par compte de base :",
      error
    );
    throw error;
  }
};

// ==========================================
// RÉCUPÉRER LES MOUVEMENTS PAR COMPTE
// GET /reception/getListMvtsCompte?compteId=...
// ==========================================

export const getListMvtsCompte = async (
  compteId: number
) => {
  try {
    if (!Number.isInteger(compteId) || compteId <= 0) {
      throw new Error(`Identifiant du compte invalide : ${compteId}`);
    }

    const response = await api.get(
      "/reception/getListMvtsCompte",
      {
        params: {
          compteId,
        },
      }
    );

    console.log("Mouvements du compte :", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Erreur récupération des mouvements du compte :",
      error
    );
    throw error;
  }
};

// ==========================================
// RÉCUPÉRER LES BONS À AFFECTER AUX CAISSES
// GET /reception/getListToCaisse?searche=...
// ==========================================

export const getListToCaisse = async (
  searche: string = ""
) => {
  try {
    const response = await api.get(
      "/reception/getListToCaisse",
      {
        params: {
          searche: searche.trim(),
        },
      }
    );

    console.log("Bons à affecter aux caisses :", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Erreur récupération des bons à affecter aux caisses :",
      error
    );
    throw error;
  }
};

// ==========================================
// CRÉER UN BON DE RÉCEPTION
// POST /reception/create
// ==========================================

export const createBonReception = async (
  data: BonReceptionRequest
): Promise<BonReception> => {
  try {
    const response = await api.post<BonReception>(
      "/reception/create",
      data
    );

    console.log("Bon de réception créé :", response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur création du bon de réception :", error);
    throw error;
  }
};

// ==========================================
// SUPPRIMER UN BON DE RÉCEPTION
// POST /reception/delete/{id}
// ==========================================

export const deleteBonReception = async (
  id: number
): Promise<BonReceptionDeleteResponse> => {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`Identifiant invalide : ${id}`);
    }

    const response = await api.post<BonReceptionDeleteResponse>(
      `/reception/delete/${id}`
    );

    console.log("Résultat suppression du bon :", response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur suppression du bon de réception :", error);
    throw error;
  }
};