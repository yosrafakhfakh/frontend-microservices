import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ClientService } from '../services/client.service';
import { Client } from '../models/client.model';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="row g-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-primary mb-0">
              <i class="fas fa-users me-2"></i>Nos Clients
            </h2>
            <div class="search-box">
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                  <i class="fas fa-search text-muted"></i>
                </span>
                <input
                  type="text"
                  class="form-control border-start-0"
                  placeholder="Rechercher un client..."
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Loading spinner -->
        <div class="text-center py-5" *ngIf="loading">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
        </div>

        <!-- Error message -->
        <div class="alert alert-danger" *ngIf="error">
          {{ error }}
          <button class="btn btn-link" (click)="loadClients()">
            Réessayer
          </button>
        </div>

        <!-- Liste des clients -->
        <ng-container *ngIf="!loading && !error">
          <div *ngFor="let client of clients" class="col-md-6 col-lg-4">
            <div class="card client-card h-100">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="client-avatar me-3">
                    <i class="fas fa-user-circle fa-2x text-primary"></i>
                  </div>
                  <h5 class="card-title mb-0">{{ client.name }}</h5>
                </div>
                <div class="client-info">
                  <p class="card-text mb-2">
                    <i class="fas fa-envelope text-muted me-2"></i>
                    {{ client.email }}
                  </p>
                </div>
                <div class="mt-3 d-flex gap-2">
                  <button
                    class="btn btn-primary flex-grow-1"
                    [routerLink]="['/factures', client.id]"
                  >
                    <i class="fas fa-file-invoice me-2"></i>Factures
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  loading = true;
  error = '';

  constructor(private clientService: ClientService, private router: Router) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.loading = true;
    this.error = '';
    this.clients = [];

    this.clientService.getClients().subscribe({
      next: (data) => {
        console.log('Données reçues:', data);
        this.clients = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.error = err;
        this.loading = false;
        if (err === 'Session expirée. Veuillez vous reconnecter.') {
          this.router.navigate(['/login']);
        }
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
