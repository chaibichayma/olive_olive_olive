
export interface BonReception {
  id: number;
  reference: string;
  compteId: number;

  name: string;
  mobile: string;

  quantityOil: number;
  quantityOlive: number;

  priceKg: number;
  price: number;
  payement: number;
  acompte: number;

  statusId: string;
  statusLib: string;

  caisse: string;
  natureId: number;

  priceOil: number;
  observation: string;

  typeHuile: number;
  isBaseCompte: boolean;

  dateCreation: string;
  dateDebProduction: string;
  dateFinProduction: string;
}