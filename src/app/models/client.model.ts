export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  _links?: {
    self: {
      href: string;
    };
    client: {
      href: string;
    };
  };
}

// Pour les réponses HAL
export interface ClientResponse {
  _embedded?: {
    clients: Client[];
  };
  _links?: {
    self: {
      href: string;
    };
  };
}
