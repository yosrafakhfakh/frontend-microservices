import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReglementService } from '../services/reglement.service';
import { Reglement } from '../models/reglement.model';

@Component({
  selector: 'app-reglements',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="row">
        <div class="col-12">
          <h2 class="text-primary mb-4">
            <i class="fas fa-money-bill-wave me-2"></i>Règlements
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
            <button class="btn btn-link" (click)="loadReglements()">
              Réessayer
            </button>
          </div>

          <!-- Liste des règlements -->
          <div class="table-responsive" *ngIf="!loading && !error">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Mode de règlement</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let reglement of reglements">
                  <td>{{ reglement.id }}</td>
                  <td>{{ reglement.dateReglement | date : 'dd/MM/yyyy' }}</td>
                  <td>{{ reglement.montant | currency : 'EUR' }}</td>
                  <td>{{ reglement.modeReglement }}</td>
                  <td>
                    <button class="btn btn-sm btn-info me-2">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger">
                      <i class="fas fa-trash"></i>
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
export class ReglementsComponent implements OnInit {
  reglements: Reglement[] = [];
  loading = true;
  error = '';

  constructor(private reglementService: ReglementService) {}

  ngOnInit() {
    this.loadReglements();
  }

  loadReglements() {
    this.loading = true;
    this.error = '';

    this.reglementService.getReglements().subscribe({
      next: (data) => {
        this.reglements = data;
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
