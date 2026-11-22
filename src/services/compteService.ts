
import api from "../lib/axios";

import type {
  Compte,
  CompteRequest,
  CompteDeleteResponse,
} from "../models/compte.model";

// ==========================================
// GET : récupérer tous les comptes
// GET /compte/getListBean?searche=...
// ==========================================

export const getListBean = async (
  searche: string = ""
): Promise<Compte[]> => {
  try {
    const response = await api.get<Compte[]>(
      "/compte/getListBean",
      {
        params: {
          searche: searche.trim(),
        },
      }
    );

    console.log("Réponse API comptes :", response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur récupération des comptes :", error);
    throw error;
  }
};

// ==========================================
// GET : récupérer un compte par ID
// GET /compte/getId/{id}
// ==========================================

export const getCompteById = async (
  id: number
): Promise<Compte> => {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`ID de compte invalide : ${id}`);
    }

    const response = await api.get<Compte>(
      `/compte/getId/${id}`
    );

    console.log("Compte récupéré :", response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur récupération du compte :", error);
    throw error;
  }
};

// ==========================================
// POST : modifier un compte
// POST /compte/update
// ==========================================

export const updateCompte = async (
  data: CompteRequest
): Promise<Compte> => {
  try {
    const response = await api.post<Compte>(
      "/compte/update",
      data
    );

    console.log("Compte modifié :", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Erreur modification du compte :", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    throw error;
  }
};

// ==========================================
// POST : créer un compte
// POST /compte/save
// ==========================================

export const saveCompte = async (
  data: CompteRequest
): Promise<Compte> => {
  try {
    const response = await api.post<Compte>(
      "/compte/save",
      data
    );

    console.log("Compte créé :", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Erreur création du compte :", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    throw error;
  }
};

// ==========================================
// POST : supprimer un compte par ID
// POST /compte/delete/{id}
// ==========================================

export const deleteCompte = async (
  id: number
): Promise<CompteDeleteResponse> => {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`ID de compte invalide : ${id}`);
    }

    const response = await api.post<CompteDeleteResponse>(
      `/compte/delete/${id}`
    );

    console.log("Résultat suppression du compte :", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Erreur suppression du compte :", {
      id,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    throw error;
  }
};
