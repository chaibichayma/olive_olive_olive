
export interface Citerne {
  createdUser?: string;
  createdDate?: string;

  createdTime?: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };

  searche?: string;
  citerneId?: number;
  reference?: string;
  libelle?: string;
  capacity?: number;

  id?: number | string;
}

export interface CiterneRequest {
  createdUser?: string;
  createdDate?: string;

  createdTime?: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };

  searche?: string;
  citerneId?: number;
  reference: string;
  libelle: string;
  capacity: number;
  id?: number | string;
}
