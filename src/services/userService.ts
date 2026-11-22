
import api from "../lib/axios";

import type {
  User,
  UserRequest,
  UserDeleteResponse,
} from "../models/user.model";

// ==========================================
// 1. RÉCUPÉRER LA LISTE DES UTILISATEURS
// GET /user/getListBean?searche=...
// ==========================================

export const getListBean = async (
  searche: string = ""
): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/user/getListBean", {
      params: { searche: searche.trim() },
    });

    console.log("Réponse API utilisateurs :", response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur récupération des utilisateurs :", error);
    throw error;
  }
};

// ==========================================
// 2. RÉCUPÉRER UN UTILISATEUR PAR ID
// GET /user/getId/{id}
// ==========================================

export const getUserById = async (
  id: number
): Promise<User> => {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`Identifiant utilisateur invalide : ${id}`);
    }

    const response = await api.get<User>(`/user/getId/${id}`);

    console.log("Utilisateur récupéré :", response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur récupération utilisateur :", error);
    throw error;
  }
};

// ==========================================
// 3. AJOUTER UN UTILISATEUR
// POST /user/save
// ==========================================

export const saveUser = async (
  data: UserRequest
): Promise<User> => {
  try {
    const response = await api.post<User>("/user/save", data);

    console.log("Utilisateur créé :", response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur création utilisateur :", error);
    throw error;
  }
};

// ==========================================
// 4. MODIFIER UN UTILISATEUR
// POST /user/update
// ==========================================

export const updateUser = async (
  data: UserRequest
): Promise<User> => {
  try {
    const response = await api.post<User>("/user/update", data);

    console.log("Utilisateur modifié :", response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur modification utilisateur :", error);
    throw error;
  }
};

// ==========================================
// 5. SUPPRIMER UN UTILISATEUR
// POST /user/delete/{id}
// ==========================================

export const deleteUser = async (
  id: number
): Promise<UserDeleteResponse> => {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`Identifiant utilisateur invalide : ${id}`);
    }

    const response = await api.post<UserDeleteResponse>(
      `/user/delete/${id}`
    );

    console.log("Résultat suppression utilisateur :", response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur suppression utilisateur :", error);
    throw error;
  }
};
