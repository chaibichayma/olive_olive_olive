import type { Saison } from "../types/saison.types";

// ==========================================
// LISTE DES SAISONS
// ==========================================

export const saisonsData: Saison[] = [
  {
    id: 1,
    beginDate: "2025-10-01",
    endDate: "2026-06-30",
    statusId: 1,
    year: 2026,
    priceKilo: 1.200,
    priceAchat: 12.500,
    priceVente: 15.000,
    nbreCaisses: 1500,
  },
  {
    id: 2,
    beginDate: "2024-10-15",
    endDate: "2025-06-15",
    statusId: 2,
    year: 2025,
    priceKilo: 1.100,
    priceAchat: 11.000,
    priceVente: 14.000,
    nbreCaisses: 1200,
  },
  {
    id: 3,
    beginDate: "2023-10-01",
    endDate: "2024-05-30",
    statusId: 2,
    year: 2024,
    priceKilo: 1.000,
    priceAchat: 10.500,
    priceVente: 13.500,
    nbreCaisses: 980,
  },
  {
    id: 4,
    beginDate: "2022-10-10",
    endDate: "2023-06-20",
    statusId: 2,
    year: 2023,
    priceKilo: 0.900,
    priceAchat: 9.500,
    priceVente: 12.000,
    nbreCaisses: 850,
  },
];