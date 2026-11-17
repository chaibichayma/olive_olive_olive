
export interface Compte {
  id: number;
  name: string;
  adresse: string;
  mobile: string;
  mail: string;
  statusId: number;
  priceConv: number | null;
  isBaseCompte: boolean;
  baseCompteId: number | null;
  image: string;
}
