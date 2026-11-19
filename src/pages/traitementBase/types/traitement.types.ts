export interface BonReception {
  id: number;
  reference: string;
  compteId: number;
  date: string;
  quantiteOlives: number;
  quantiteHuile: number;
  rendement: number;
  montantTotal: number;
  resteAPayer: number;
  statut: string;
}