import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ProduitResponse, Produit } from '../models/produit.model';

@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  private apiUrl = 'http://localhost:8082/produits';

  constructor(private http: HttpClient) {}

  getProduits(): Observable<Produit[]> {
    return this.http
      .get<ProduitResponse>(this.apiUrl)
      .pipe(map((response) => response._embedded.produits));
  }
}
