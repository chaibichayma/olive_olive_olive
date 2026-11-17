export type SaisonStatus = "Clôturée" | "En cours";

export interface Saison {
  id: number;
  beginDate: string;    // Date début saison
  endDate: string;      // Date fin saison
  statusId: number;     // Statut : clôturée / en cours
  year: number;         // Année de la saison
  priceKilo: number;    // Prix de production d'un kilo d'olives
  priceAchat: number;   // Prix d'achat d'un litre d'huile
  priceVente: number;   // Prix de vente d'un litre d'huile
  nbreCaisses: number;  // Nombre de caisses
}