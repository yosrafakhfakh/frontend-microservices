import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  tap,
  catchError,
  throwError,
  finalize,
} from 'rxjs';
import { LoginRequest } from '../models/auth.model';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8089'; // Ajustez l'URL selon votre backend
  private tokenKey = 'auth_token';
  private userRolesKey = 'user_roles';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);
  private isBrowser: boolean;
  private currentUser: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.checkAuthStatus();
    }
  }

  private checkAuthStatus() {
    if (!this.isBrowser) return;

    const token = this.getToken();
    if (token) {
      this.isAuthenticatedSubject.next(true);
      this.loadUserFromToken();
    }
  }

  login(credentials: LoginRequest): Observable<any> {
    const body = new URLSearchParams();
    body.set('username', credentials.username);
    body.set('password', credentials.password);

    return this.http
      .post(`${this.apiUrl}/login`, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .pipe(
        tap((response: any) => {
          const accessToken = response['access-token'];
          if (accessToken && this.isBrowser) {
            this.setToken(accessToken);
            this.isAuthenticatedSubject.next(true);
            this.loadUserFromToken();
            this.router.navigate(['/dashboard']);
          }
        }),
        catchError((error) => {
          console.error("Erreur d'authentification:", error);
          return throwError(() => 'Identifiants invalides');
        })
      );
  }

  logout(): void {
    if (this.isBrowser) {
      this.removeToken();
      localStorage.removeItem(this.userRolesKey);
    }
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private getUserRoles(): string[] {
    if (!this.isBrowser) return [];
    const roles = localStorage.getItem(this.userRolesKey);
    return roles ? JSON.parse(roles) : [];
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  getUserRole(): string {
    return this.currentUser?.roles[0] || '';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  loadUserFromToken() {
  if (!this.isBrowser) return;

  const token = this.getToken();
  if (token) {
    const user = this.decodeToken(token);
    if (user) {
      this.currentUser = user;  // Ajoute cette ligne
      this.currentUserSubject.next(user);
    }
  }
}

  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  getCurrentUserId(): number | null {
  const user = this.currentUserSubject.value;
  return user?.userId || null;
}

  refreshToken() {
    if (!this.isBrowser) return;
    this.logout();
    this.router.navigate(['/login']);
  }
}
