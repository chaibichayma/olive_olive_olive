
import api from "../lib/axios";

import type {
  Saison,
  SaisonRequest,
} from "../models/saison.model";

// ==========================================
// GET : récupérer toutes les saisons
// GET /season/getListBean?searche=...
// ==========================================

export const getListBean = async (
  searche: string = ""
): Promise<Saison[]> => {
  try {
    const response = await api.get<Saison[]>(
      "/season/getListBean",
      {
        params: {
          searche: searche.trim(),
        },
      }
    );

    console.log("Réponse API saisons :", response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur récupération des saisons :", error);
    throw error;
  }
};

// ==========================================
// GET : récupérer une saison par ID
// GET /season/getId/{id}
// ==========================================


export const getSaisonById = async (
  id: number
): Promise<Saison> => {
  try {
    const response = await api.get<Saison>(
      `/season/getId/${id}`
    );

    console.log("Saison récupérée :", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Erreur récupération de la saison :", {
      id,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    throw error;
  }
};


// ==========================================
// POST : modifier une saison
// POST /season/update
// ==========================================


// ==========================================
// POST : modifier une saison
// POST /season/update
// Body : SaisonRequest
// ==========================================

export const updateSaison = async (
  data: SaisonRequest
): Promise<Saison> => {
  try {
    if (!data.id) {
      throw new Error(
        "L'identifiant de la saison est obligatoire pour la modification."
      );
    }

    const response = await api.post<Saison>(
      "/season/update",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Saison modifiée :", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Erreur modification de la saison :", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    throw error;
  }
};


// ==========================================
// POST : créer une saison
// POST /season/save
// ==========================================

export const saveSaison = async (
  data: SaisonRequest
): Promise<Saison> => {
  try {
    const response = await api.post<Saison>(
      "/season/save",
      data
    );

    console.log("Saison créée :", response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur création de la saison :", error);
    throw error;
  }
};

// ==========================================
// POST : supprimer une saison
// POST /season/delete/{id}
// ==========================================


export const deleteSaison = async (
  id: number
): Promise<unknown> => {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`ID de saison invalide : ${id}`);
    }

    const response = await api.post(
      `/season/delete/${id}`
    );

    console.log("Suppression réussie :", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Erreur suppression de la saison :", {
      id,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    throw error;
  }
};
