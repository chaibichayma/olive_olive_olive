
export interface Saison {
  createdUser?: string;
  createdDate?: string;

  createdTime?: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };

  searche?: string;
  beginDate?: string;
  endDate?: string;
  statusId?: number;
  year?: number;
  priceKilo?: number;
  priceAchat?: number;
  priceVente?: number;
  nbreCaisses?: number;

  id?: number | string;
}

export interface SaisonRequest {
  createdUser?: string;
  createdDate?: string;

  createdTime?: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };

  searche?: string;
  beginDate: string;
  endDate: string;
  statusId: number;
  year: number;
  priceKilo: number;
  priceAchat: number;
  priceVente: number;
  nbreCaisses: number;

  id?: number | string;
}
