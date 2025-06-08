export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtResponse {
  access_token: string;
  token_type: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  roles: string[];
}

export interface User {
  id?: number;
  username: string;
  email: string;
  roles: string[];
}
