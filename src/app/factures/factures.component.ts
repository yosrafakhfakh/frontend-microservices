import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FactureService } from '../services/facture.service';
import { Facture } from '../models/facture.model';

@Component({
  selector: 'app-factures',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="row">
        <div class="col-12">
          <h2 class="text-primary mb-4">
            <i class="fas fa-file-invoice me-2"></i>
            {{ clientId ? 'Factures du client' : 'Toutes les factures' }}
          </h2>

          <!-- Loading spinner -->
          <div class="text-center py-5" *ngIf="loading">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Chargement...</span>
            </div>
          </div>

          <!-- Error message -->
          <div class="alert alert-danger" *ngIf="error">
            {{ error }}
            <button class="btn btn-link" (click)="loadFactures()">
              Réessayer
            </button>
          </div>

          <!-- Liste des factures -->
          <div class="table-responsive" *ngIf="!loading && !error">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>N° Facture</th>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Montant</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let facture of factures">
                  <td>{{ facture.id }}</td>
                  <td>{{ facture.dateFacture | date : 'dd/MM/yyyy' }}</td>
                  <td>{{ facture.client?.name || 'N/A' }}</td>
                  <td>{{ facture.montantTotal | currency : 'EUR' }}</td>
                  <td>
                    <button
                      class="btn btn-sm btn-info me-2"
                      [routerLink]="['/factures', facture.id]"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-success me-2"
                      [routerLink]="['/factures', facture.id, 'reglements']"
                    >
                      <i class="fas fa-money-bill-wave"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .table th,
      .table td {
        vertical-align: middle;
      }
    `,
  ],
})
export class FacturesComponent implements OnInit {
  factures: Facture[] = [];
  loading = true;
  error = '';
  clientId: number | null = null;

  constructor(
    private factureService: FactureService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.clientId = params['clientId'] ? +params['clientId'] : null;
      this.loadFactures();
    });
  }

  loadFactures() {
    this.loading = true;
    this.error = '';

    const request = this.clientId
      ? this.factureService.getFacturesByClient(this.clientId)
      : this.factureService.getFactures();

    request.subscribe({
      next: (data) => {
        this.factures = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.error = err;
        this.loading = false;
      },
    });
  }
}
