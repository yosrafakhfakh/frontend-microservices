export interface ProduitResponse {
  _embedded: {
    produits: Produit[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface Produit {
  id: number;
  name: string;
  price: number;
  quantity: number;
  _links: {
    self: { href: string };
    produit: { href: string };
  };
}
