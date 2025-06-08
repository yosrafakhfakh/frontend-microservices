import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ClientsComponent } from './clients/clients.component';
import { ProduitsComponent } from './produits/produits.component';
import { FacturesComponent } from './factures/factures.component';
import { ReglementsComponent } from './reglements/reglements.component';

const routes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'accueil', component: AccueilComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'produits', component: ProduitsComponent },
  { path: 'factures', component: FacturesComponent },
  { path: 'reglements', component: ReglementsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
