import { Facture } from './facture.model';

export interface Reglement {
  id: number;
  montant: number;
  dateReglement: string;
  modeReglement: string;
  factureId?: number;
  clientId?: number;
}
