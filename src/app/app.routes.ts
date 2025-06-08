import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'accueil',
    loadComponent: () =>
      import('./accueil/accueil.component').then((m) => m.AccueilComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'clients',
    loadComponent: () =>
      import('./clients/clients.component').then((m) => m.ClientsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'produits',
    loadComponent: () =>
      import('./produits/produits.component').then((m) => m.ProduitsComponent),
  },
  {
    path: 'factures',
    loadComponent: () =>
      import('./factures/factures.component').then((m) => m.FacturesComponent),
  },
  {
    path: 'factures/:clientId',
    loadComponent: () =>
      import('./factures/factures.component').then((m) => m.FacturesComponent),
  },
  {
    path: 'clients/:clientId/factures',
    loadComponent: () =>
      import('./factures/factures.component').then((m) => m.FacturesComponent),
  },
  {
    path: 'factures',
    loadComponent: () =>
      import('./factures/factures.component').then((m) => m.FacturesComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'reglements',
    loadComponent: () =>
      import('./reglements/reglements.component').then(
        (m) => m.ReglementsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'mes-reglements',
    loadComponent: () =>
      import('./reglements/reglements.component').then(
        (m) => m.ReglementsComponent
      ),
    canActivate: [AuthGuard],
    data: { role: 'USER' },
  },
  {
    path: 'reglements/:factureId',
    loadComponent: () =>
      import('./reglements/reglements.component').then(
        (m) => m.ReglementsComponent
      ),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('.//auth/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },
  { path: '**', redirectTo: '/accueil' },
];
