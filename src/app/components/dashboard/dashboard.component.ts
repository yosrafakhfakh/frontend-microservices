import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactureService } from '../../services/facture.service';
import { ClientService } from '../../services/client.service';
import { ProduitService } from '../../services/produit.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <!-- En-tête du dashboard -->
      <div class="dashboard-header">
        <div>
          <h1 class="dashboard-title">Tableau de bord</h1>
          <p class="dashboard-subtitle">Vue d'ensemble de votre activité</p>
        </div>
        <div class="period-selector">
          <div class="btn-group" role="group">
            <button class="btn btn-outline-primary active">Jour</button>
            <button class="btn btn-outline-primary">Semaine</button>
            <button class="btn btn-outline-primary">Mois</button>
          </div>
        </div>
      </div>

      <!-- Section des statistiques de règlement -->
      <div class="reglement-stats-section">
        <div class="row">
          <!-- Graphique circulaire -->
          <div class="col-md-4">
            <div class="chart-card">
              <h3>État des règlements</h3>
              <canvas id="reglementChart"></canvas>
            </div>
          </div>

          <!-- Statistiques détaillées -->
          <div class="col-md-8">
            <div class="stats-grid">
              <div class="stat-card primary-card">
                <div class="stat-card-content">
                  <div class="stat-card-info">
                    <h3 class="stat-card-value">
                      {{ stats.totalFactures }}
                    </h3>
                    <p class="stat-card-label">Total des factures</p>
                  </div>
                  <div class="stat-card-icon">
                    <i class="fas fa-file-invoice"></i>
                  </div>
                </div>
                <div class="stat-card-footer">
                  <span>Nombre total de factures</span>
                </div>
              </div>

              <div class="stat-card success-card">
                <div class="stat-card-content">
                  <div class="stat-card-info">
                    <h3 class="stat-card-value">{{ stats.totalReglees }}</h3>
                    <p class="stat-card-label">Factures réglées</p>
                    <span class="stat-card-amount"
                      >{{
                        (stats.totalReglees / stats.totalFactures) * 100
                          | number : '1.0-0'
                      }}%</span
                    >
                  </div>
                  <div class="stat-card-icon">
                    <i class="fas fa-check-circle"></i>
                  </div>
                </div>
                <div class="stat-card-footer">
                  <span>Paiements reçus</span>
                </div>
              </div>

              <div class="stat-card warning-card">
                <div class="stat-card-content">
                  <div class="stat-card-info">
                    <h3 class="stat-card-value">{{ stats.totalNonReglees }}</h3>
                    <p class="stat-card-label">Factures non réglées</p>
                    <span class="stat-card-amount"
                      >{{
                        (stats.totalNonReglees / stats.totalFactures) * 100
                          | number : '1.0-0'
                      }}%</span
                    >
                  </div>
                  <div class="stat-card-icon">
                    <i class="fas fa-times-circle"></i>
                  </div>
                </div>
                <div class="stat-card-footer">
                  <span>En attente de paiement</span>
                </div>
              </div>
            </div>

            <!-- Détails des montants -->
            <div class="montants-details mt-4">
              <div class="row">
                <div class="col-md-6">
                  <div class="montant-card">
                    <h4>Montant total réglé</h4>
                    <div class="montant-value success">
                      {{ stats.montantRegle | number : '1.0-0' }} €
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="montant-card">
                    <h4>Montant en attente</h4>
                    <div class="montant-value warning">
                      {{ stats.montantEnAttente | number : '1.0-0' }} €
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section des factures -->
      <div class="factures-section">
        <div class="factures-grid">
          <!-- Factures réglées -->
          <div class="factures-card">
            <div class="factures-card-header">
              <div class="factures-card-title">
                <i class="fas fa-check-circle text-success"></i>
                <h2>
                  Factures réglées
                  <span class="badge">{{ stats.totalReglees }}</span>
                </h2>
              </div>
              <button class="btn btn-outline-primary btn-sm">Voir tout</button>
            </div>
            <div class="factures-list">
              <div class="facture-item">
                <div class="facture-info">
                  <div class="facture-primary">
                    <span class="facture-id">#FA-2024-001</span>
                    <span class="facture-client">Client ABC</span>
                  </div>
                  <div class="facture-secondary">
                    <span class="facture-date">Payée le 15/03/2024</span>
                    <span class="facture-amount">1,250 €</span>
                  </div>
                </div>
                <div class="facture-status success">
                  <i class="fas fa-check"></i>
                </div>
              </div>
              <!-- Répéter pour d'autres factures -->
            </div>
          </div>

          <!-- Factures en attente -->
          <div class="factures-card">
            <div class="factures-card-header">
              <div class="factures-card-title">
                <i class="fas fa-clock text-warning"></i>
                <h2>
                  En attente
                  <span class="badge">{{
                    stats.totalEnAttente + stats.totalEnRetard
                  }}</span>
                </h2>
              </div>
              <button class="btn btn-outline-primary btn-sm">Voir tout</button>
            </div>
            <div class="factures-list">
              <div class="facture-item">
                <div class="facture-info">
                  <div class="facture-primary">
                    <span class="facture-id">#FA-2024-002</span>
                    <span class="facture-client">Client XYZ</span>
                  </div>
                  <div class="facture-secondary">
                    <span class="facture-date">Échéance: 25/03/2024</span>
                    <span class="facture-amount">2,350 €</span>
                  </div>
                </div>
                <div class="facture-status warning">
                  <i class="fas fa-clock"></i>
                </div>
              </div>
              <!-- Répéter pour d'autres factures -->
            </div>
          </div>
        </div>
      </div>

      <!-- Nouvelles sections -->
      <div class="dashboard-grid mt-4">
        <!-- Clients fidèles -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-crown text-warning me-2"></i>
              Top Clients Fidèles
            </h3>
          </div>
          <div class="card-body p-0">
            <div class="list-group list-group-flush">
              <div class="list-group-item" *ngFor="let client of topClients">
                <div class="d-flex align-items-center">
                  <div class="client-avatar">
                    <i class="fas fa-user"></i>
                  </div>
                  <div class="ms-3">
                    <h6 class="mb-1">{{ client.name }}</h6>
                    <small class="text-muted">
                      {{ client.totalAchats | number : '1.0-0' }} €
                    </small>
                  </div>
                  <span class="badge bg-success ms-auto">
                    {{ client.nombreCommandes }} commandes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Produits populaires -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-star text-primary me-2"></i>
              Produits les plus vendus
            </h3>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary active">Global</button>
              <button class="btn btn-outline-primary">2024</button>
              <button class="btn btn-outline-primary">2023</button>
            </div>
          </div>
          <div class="card-body p-0">
            <div class="list-group list-group-flush">
              <div class="list-group-item" *ngFor="let produit of topProduits">
                <div class="d-flex align-items-center">
                  <div class="product-icon">
                    <i class="fas fa-box"></i>
                  </div>
                  <div class="ms-3 flex-grow-1">
                    <h6 class="mb-1">{{ produit.name }}</h6>
                    <small class="text-muted">
                      {{ produit.quantiteVendue }} unités vendues
                    </small>
                  </div>
                  <div class="text-end">
                    <div class="fw-bold">
                      {{ produit.chiffreAffaires | number : '1.0-0' }} €
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stock critique -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-exclamation-triangle text-danger me-2"></i>
              Ruptures de stock
            </h3>
          </div>
          <div class="card-body p-0">
            <div class="list-group list-group-flush">
              <div
                class="list-group-item"
                *ngFor="let produit of produitsRupture"
              >
                <div class="d-flex align-items-center">
                  <div class="product-icon bg-danger-light">
                    <i class="fas fa-box text-danger"></i>
                  </div>
                  <div class="ms-3 flex-grow-1">
                    <h6 class="mb-1">{{ produit.name }}</h6>
                    <div class="stock-bar">
                      <div
                        class="stock-progress"
                        [style.width.%]="
                          (produit.quantite / produit.seuilAlerte) * 100
                        "
                      ></div>
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="text-danger fw-bold">
                      {{ produit.quantite }} en stock
                    </div>
                    <small class="text-muted"
                      >Seuil: {{ produit.seuilAlerte }}</small
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dettes clients -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-hand-holding-usd text-warning me-2"></i>
              Dettes par client
            </h3>
          </div>
          <div class="card-body p-0">
            <div class="list-group list-group-flush">
              <div class="list-group-item" *ngFor="let dette of dettesClients">
                <div class="d-flex align-items-center">
                  <div class="client-avatar">
                    <i class="fas fa-user"></i>
                  </div>
                  <div class="ms-3 flex-grow-1">
                    <h6 class="mb-1">{{ dette.client.name }}</h6>
                    <small class="text-muted">
                      {{ dette.nombreFactures }} factures en attente
                    </small>
                  </div>
                  <div class="text-end">
                    <div class="text-danger fw-bold">
                      {{ dette.montantTotal | number : '1.0-0' }} €
                    </div>
                    <small class="text-danger">
                      Retard: {{ dette.joursRetardMoyen }} jours
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 2rem;
        background-color: var(--gray-50);
        min-height: calc(100vh - 70px);
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .dashboard-title {
        font-size: 1.75rem;
        font-weight: 600;
        color: var(--gray-900);
        margin-bottom: 0.5rem;
      }

      .dashboard-subtitle {
        color: var(--gray-600);
        margin: 0;
      }

      .reglement-stats-section {
        background: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 30px;
      }

      .chart-card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        height: 100%;
        text-align: center;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
      }

      .stat-card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .stat-card-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .stat-card-info {
        flex: 1;
      }

      .stat-card-value {
        font-size: 24px;
        font-weight: 600;
        margin: 0;
        color: #2c3e50;
      }

      .stat-card-label {
        color: #6c757d;
        margin: 5px 0;
      }

      .stat-card-amount {
        font-size: 14px;
        color: #28a745;
        font-weight: 500;
      }

      .stat-card-icon {
        font-size: 24px;
        margin-left: 15px;
      }

      .stat-card-footer {
        margin-top: 15px;
        padding-top: 10px;
        border-top: 1px solid #eee;
        color: #6c757d;
        font-size: 14px;
      }

      .montants-details {
        background: white;
        border-radius: 8px;
        padding: 20px;
      }

      .montant-card {
        text-align: center;
        padding: 15px;
      }

      .montant-card h4 {
        color: #6c757d;
        font-size: 16px;
        margin-bottom: 10px;
      }

      .montant-value {
        font-size: 24px;
        font-weight: 600;
      }

      .montant-value.success {
        color: #28a745;
      }

      .montant-value.warning {
        color: #ffc107;
      }

      .primary-card .stat-card-icon {
        color: #007bff;
      }
      .success-card .stat-card-icon {
        color: #28a745;
      }
      .warning-card .stat-card-icon {
        color: #ffc107;
      }

      .factures-section {
        margin-top: 2rem;
      }

      .factures-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 1.5rem;
      }

      .factures-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }

      .factures-card-header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--gray-100);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .factures-card-title {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .factures-card-title h2 {
        font-size: 1.25rem;
        margin: 0;
      }

      .badge {
        background: var(--gray-100);
        color: var(--gray-700);
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.875rem;
      }

      .factures-list {
        padding: 1rem;
      }

      .facture-item {
        padding: 1rem;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.2s;
      }

      .facture-item:hover {
        background-color: var(--gray-50);
      }

      .facture-info {
        flex: 1;
      }

      .facture-primary {
        margin-bottom: 0.5rem;
      }

      .facture-id {
        font-weight: 500;
        margin-right: 1rem;
      }

      .facture-client {
        color: var(--gray-600);
      }

      .facture-secondary {
        font-size: 0.875rem;
        color: var(--gray-500);
      }

      .facture-date {
        margin-right: 1rem;
      }

      .facture-amount {
        font-weight: 500;
        color: var(--gray-700);
      }

      .facture-status {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 1rem;
      }

      .facture-status.success {
        background-color: var(--success-light);
        color: var(--success);
      }

      .facture-status.warning {
        background-color: var(--warning-light);
        color: var(--warning);
      }

      @media (max-width: 768px) {
        .dashboard-container {
          padding: 1rem;
        }

        .dashboard-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }

        .stats-grid {
          grid-template-columns: 1fr;
        }

        .factures-grid {
          grid-template-columns: 1fr;
        }
      }

      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 1.5rem;
      }

      .dashboard-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: var(--shadow);
      }

      .card-header {
        padding: 1.25rem;
        border-bottom: 1px solid var(--gray-200);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .card-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0;
        color: var(--gray-800);
      }

      .client-avatar,
      .product-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--gray-100);
        color: var(--gray-600);
      }

      .stock-bar {
        height: 6px;
        background: var(--gray-200);
        border-radius: 3px;
        overflow: hidden;
        margin-top: 4px;
      }

      .stock-progress {
        height: 100%;
        background: var(--danger);
        border-radius: 3px;
      }

      .badge {
        padding: 0.5em 0.75em;
        font-weight: 500;
      }

      .list-group-item {
        padding: 1rem 1.25rem;
        border-left: none;
        border-right: none;
      }

      .list-group-item:first-child {
        border-top: none;
      }

      .list-group-item:last-child {
        border-bottom: none;
      }

      .btn-group-sm .btn {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  stats = {
    totalReglees: 0,
    totalEnAttente: 0,
    totalEnRetard: 0,
    montantTotal: 0,
    montantRegle: 0,
    montantEnAttente: 0,
    totalFactures: 0,
    totalNonReglees: 0,
  };

  topClients: any[] = [];
  topProduits: any[] = [];
  produitsRupture: any[] = [];
  dettesClients: any[] = [];

  constructor(
    private factureService: FactureService,
    private clientService: ClientService,
    private produitService: ProduitService
  ) {}

  ngOnInit() {
    this.loadStatistiques();
    this.loadTopClients();
    this.loadTopProduits();
    this.loadProduitsRupture();
    this.loadDettesClients();
  }

  private loadStatistiques() {
    this.factureService.getStatistiques().subscribe({
      next: (data) => {
        this.stats = {
          ...data,
          totalFactures:
            data.totalReglees + data.totalEnAttente + data.totalEnRetard,
          totalNonReglees: data.totalEnAttente + data.totalEnRetard,
        };
        this.initReglementChart();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
      },
    });
  }

  private initReglementChart() {
    const ctx = document.getElementById('reglementChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Réglées', 'Non réglées'],
          datasets: [
            {
              data: [this.stats.totalReglees, this.stats.totalNonReglees],
              backgroundColor: ['#28a745', '#ffc107'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        },
      });
    }
  }

  private loadTopClients() {
    // Implémenter la logique pour charger les meilleurs clients
  }

  private loadTopProduits() {
    // Implémenter la logique pour charger les produits les plus vendus
  }

  private loadProduitsRupture() {
    // Implémenter la logique pour charger les produits en rupture
  }

  private loadDettesClients() {
    // Implémenter la logique pour charger les dettes des clients
  }
}
