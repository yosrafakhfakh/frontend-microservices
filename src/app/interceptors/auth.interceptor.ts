import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Ne pas intercepter les requêtes vers /login
  if (req.url.includes('/login')) {
    return next(req);
  }

  if (!token) {
    // Si pas de token, rediriger vers login
    router.navigate(['/login']);
    return throwError(() => 'Authentification requise');
  }

  // Ajouter le token à la requête
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 302) {
        authService.logout();
        router.navigate(['/login']);
        return throwError(() => 'Session expirée');
      }
      return throwError(() => error);
    })
  );
}
