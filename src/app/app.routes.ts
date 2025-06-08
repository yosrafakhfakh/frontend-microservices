import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'accueil',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
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
    canActivate: [AuthGuard],
  },
  {
    path: 'factures',
    loadComponent: () =>
      import('./factures/factures.component').then((m) => m.FacturesComponent),
    canActivate: [AuthGuard],
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
    path: 'unauthorized',
    loadComponent: () =>
      import('./auth/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },
  { path: '**', redirectTo: '/accueil' },
];
