import type { Citerne } from "../types/citerne.types";

// ==========================================
// LISTE DES CITERNES
// ==========================================

export const citernesData: Citerne[] = [
  {
    id: 1,
    reference: "CIT-001",
    capacite: 10000,
    dateFabrication: "2022-05-15",
    name: "Citerne principale",
  },
  {
    id: 2,
    reference: "CIT-002",
    capacite: 15000,
    dateFabrication: "2023-03-20",
    name: "Citerne de stockage A",
  },
  {
    id: 3,
    reference: "CIT-003",
    capacite: 8000,
    dateFabrication: "2021-11-10",
    name: "Citerne de stockage B",
  },
  {
    id: 4,
    reference: "CIT-004",
    capacite: 12000,
    dateFabrication: "2024-01-25",
    name: "Citerne secondaire",
  },
  {
    id: 5,
    reference: "CIT-005",
    capacite: 6000,
    dateFabrication: "2020-08-12",
    name: "Citerne de réserve",
  },
];