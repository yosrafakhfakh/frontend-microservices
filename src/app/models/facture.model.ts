import { Client } from './client.model';
import { Produit } from './produit.model';

export interface FactureResponse {
  _embedded?: {
    factures: Facture[];
  };
  _links?: {
    self: { href: string };
  };
}

export interface Facture {
  id: number;
  dateFacture: string;
  montantTotal: number;
  statut: 'REGLE' | 'EN_ATTENTE' | 'EN_RETARD';
  clientId?: number;
  client?: {
    id: number;
    name: string;
    email: string;
  };
  reglements?: {
    id: number;
    montant: number;
    dateReglement: string;
    modeReglement: string;
  }[];
}

export interface FactureLigne {
  id: number;
  produit: {
    id: number;
    name: string;
    price: number;
  };
  quantite: number;
  prixUnitaire: number;
  montant: number;
}
