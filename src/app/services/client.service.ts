import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Client } from '../models/client.model';

interface HalResponse {
  _embedded: {
    clients: Client[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = '/api/clients';


  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<HalResponse>(this.apiUrl).pipe(
      map((response) => {
        console.log('Réponse du serveur:', response);
        return response?._embedded?.clients || [];
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération des clients:', error);
        if (error.status === 302 || error.status === 200) {
          return throwError(() => 'Redirection non autorisée');
        }
        return throwError(() => error.message);
      })
    );
  }

  getClient(id: number): Observable<Client> {
    return this.http
      .get<Client>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createClient(client: Client): Observable<Client> {
    return this.http
      .post<Client>(this.apiUrl, client)
      .pipe(catchError(this.handleError));
  }

  updateClient(id: number, client: Client): Observable<Client> {
    return this.http
      .put<Client>(`${this.apiUrl}/${id}`, client)
      .pipe(catchError(this.handleError));
  }

  deleteClient(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error("Une erreur s'est produite:", error);
    if (error.status === 0) {
      return throwError(() => "Le serveur n'est pas accessible");
    }
    if (error.status === 302 || error.status === 200) {
      return throwError(() => 'Redirection non autorisée');
    }
    return throwError(() => `Erreur ${error.status}: ${error.message}`);
  }
}
