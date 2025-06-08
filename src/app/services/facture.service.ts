import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Facture } from '../models/facture.model';
import { AuthService } from '../services/auth.service';

interface HalResponse {
  _embedded: {
    factures: Facture[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class FactureService {
  private apiUrl = '/factures';

  constructor(private http: HttpClient, private authService: AuthService) {}

getFactures(): Observable<Facture[]> {
  if (this.authService.isAdmin()) {
    return this.http.get<HalResponse>(this.apiUrl).pipe(
      map(response => response?._embedded?.factures || []),
      catchError(this.handleError)
    );
  } else {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      // Gérer le cas userId manquant, ici on renvoie une erreur observable
      return throwError(() => new Error('UserId est undefined ou null'));
    }
    return this.http
      .get<Facture[]>(`${this.apiUrl}/user/${userId}`)
      .pipe(catchError(this.handleError));
  }
}


 getFacturesByClient(clientId: number): Observable<Facture[]> {
  return this.http.get<Facture[]>(`${this.apiUrl}/user/${clientId}`).pipe(
    map((response) => {
      console.log('Factures du client:', response);
      return Array.isArray(response) ? response : [response];
    }),
    catchError(this.handleError)
  );
}

  getFacture(id: number): Observable<Facture> {
    return this.http
      .get<Facture>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getStatistiques() {
    return this.getFactures().pipe(
      map((factures) => ({
        totalReglees: factures.filter((f) => f.statut === 'REGLE').length,
        totalEnAttente: factures.filter((f) => f.statut === 'EN_ATTENTE')
          .length,
        totalEnRetard: factures.filter((f) => f.statut === 'EN_RETARD').length,
        montantTotal: factures.reduce((sum, f) => sum + f.montantTotal, 0),
        montantRegle: factures
          .filter((f) => f.statut === 'REGLE')
          .reduce((sum, f) => sum + f.montantTotal, 0),
        montantEnAttente: factures
          .filter((f) => f.statut !== 'REGLE')
          .reduce((sum, f) => sum + f.montantTotal, 0),
      }))
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
}
