import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccueilComponent } from './accueil/accueil.component';
import { ClientsComponent } from './clients/clients.component';
import { ProduitsComponent } from './produits/produits.component';
import { FacturesComponent } from './factures/factures.component';
import { ReglementsComponent } from './reglements/reglements.component';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    ClientsComponent,
    ProduitsComponent,
    FacturesComponent,
    ReglementsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
