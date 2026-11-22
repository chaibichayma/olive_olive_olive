
import api from "../lib/axios";

import type {
  Citerne,
  CiterneRequest,
} from "../models/citerne.model";

// ==========================================
// GET : récupérer toutes les citernes
// GET /citerne/getListBean?searche=...
// ==========================================

export const getListBean = async (
  searche: string = ""
): Promise<Citerne[]> => {
  try {
    const response = await api.get<Citerne[]>(
      "/citerne/getListBean",
      {
        params: {
          searche: searche.trim(),
        },
      }
    );

    console.log("Réponse API citernes :", response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur récupération des citernes :", error);
    throw error;
  }
};

// ==========================================
// GET : récupérer une citerne par ID
// GET /citerne/getId/{id}
// ==========================================

export const getCiterneById = async (
  id: number
): Promise<Citerne> => {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`ID de citerne invalide : ${id}`);
    }

    const response = await api.get<Citerne>(
      `/citerne/getId/${id}`
    );

    console.log("Citerne récupérée :", response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur récupération de la citerne :", error);
    throw error;
  }
};

// ==========================================
// POST : modifier une citerne
// POST /citerne/update
// ==========================================

export const updateCiterne = async (
  data: CiterneRequest
): Promise<Citerne> => {
  try {
    const response = await api.post<Citerne>(
      "/citerne/update",
      data
    );

    console.log("Citerne modifiée :", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Erreur modification de la citerne :", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    throw error;
  }
};

// ==========================================
// POST : créer une citerne
// POST /citerne/save
// ==========================================

export const saveCiterne = async (
  data: CiterneRequest
): Promise<Citerne> => {
  try {
    const response = await api.post<Citerne>(
      "/citerne/save",
      data
    );

    console.log("Citerne créée :", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Erreur création de la citerne :", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    throw error;
  }
};



 // ==========================================
 // POST : supprimer une citerne par ID
 // POST /citerne/delete/{id}
 // ==========================================

export const deleteCiterne = async (
  id: number
): Promise<unknown> => {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`ID de citerne invalide : ${id}`);
    }

    const response = await api.post(
      `/citerne/delete/${id}`
    );

    console.log("Suppression réussie :", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Erreur suppression de la citerne :", {
      id,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    throw error;
  }
};
