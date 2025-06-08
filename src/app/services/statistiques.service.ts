import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatistiquesService {
  private apiUrl = 'http://localhost:8089/api/statistiques';

  constructor(private http: HttpClient) {}

  getTopClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-clients`);
  }

  getTopProduits(annee?: number): Observable<any[]> {
    const params = annee
      ? { params: new HttpParams().set('annee', annee) }
      : {};
    return this.http.get<any[]>(`${this.apiUrl}/top-produits`, params);
  }

  getProduitsRupture(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produits-rupture`);
  }

  getDettesClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dettes-clients`);
  }
}
