import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Reglement } from '../models/reglement.model';

interface HalResponse {
  _embedded: {
    reglements: Reglement[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class ReglementService {
  private apiUrl = '/reglements'; // Sera redirigé vers http://localhost:8084/reglements

  constructor(private http: HttpClient) {}

  getReglements(): Observable<Reglement[]> {
    return this.http.get<HalResponse>(this.apiUrl).pipe(
      map((response) => {
        console.log('Réponse du serveur:', response);
        return response?._embedded?.reglements || [];
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Une erreur est survenue:', error);
    if (error.status === 0) {
      return throwError(() => "Le serveur n'est pas accessible");
    }
    if (error.status === 401) {
      return throwError(() => 'Non autorisé');
    }
    return throwError(() => `Erreur ${error.status}: ${error.message}`);
  }

  getReglementsByFacture(factureId: number): Observable<Reglement[]> {
    return this.http.get<Reglement[]>(`${this.apiUrl}/${factureId}/full`).pipe(
      map((response) => {
        return Array.isArray(response) ? response : [response];
      })
    );
  }

  addReglement(reglement: Reglement): Observable<Reglement> {
    return this.http.post<Reglement>(this.apiUrl, reglement);
  }
}
