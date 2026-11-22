export interface Compte {
  id?: number;
  compteId?: number;
  reference?: string;
  name?: string;
  mobile?: string;
  priceKg?: number;
  isBaseCompte?: boolean;
}

export interface CompteRequest {
  id?: number;
  compteId?: number;
  reference: string;
  name: string;
  mobile: string;
  priceKg: number;
  isBaseCompte: boolean;
}

export interface CompteDeleteResponse {
  message: string;
  isValid: boolean;
}