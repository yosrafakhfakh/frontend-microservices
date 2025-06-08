import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactureService } from '../../services/facture.service';
import { ClientService } from '../../services/client.service';
import { ProduitService } from '../../services/produit.service';

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

      <!-- Cartes statistiques -->
      <div class="stats-grid">
        <div class="stat-card primary-card">
          <div class="stat-card-content">
            <div class="stat-card-info">
              <h3 class="stat-card-value">
                {{ stats.montantTotal | number : '1.0-0' }} €
              </h3>
              <p class="stat-card-label">Chiffre d'affaires</p>
            </div>
            <div class="stat-card-icon">
              <i class="fas fa-chart-line"></i>
            </div>
          </div>
          <div class="stat-card-footer">
            <span>Total des factures</span>
          </div>
        </div>

        <div class="stat-card success-card">
          <div class="stat-card-content">
            <div class="stat-card-info">
              <h3 class="stat-card-value">{{ stats.totalReglees }}</h3>
              <p class="stat-card-label">Factures réglées</p>
              <span class="stat-card-amount"
                >{{ stats.montantRegle | number : '1.0-0' }} €</span
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
              <h3 class="stat-card-value">{{ stats.totalEnAttente }}</h3>
              <p class="stat-card-label">En attente</p>
              <span class="stat-card-amount"
                >{{ stats.montantEnAttente | number : '1.0-0' }} €</span
              >
            </div>
            <div class="stat-card-icon">
              <i class="fas fa-clock"></i>
            </div>
          </div>
          <div class="stat-card-footer">
            <span>Paiements en attente</span>
          </div>
        </div>

        <div class="stat-card danger-card">
          <div class="stat-card-content">
            <div class="stat-card-info">
              <h3 class="stat-card-value">{{ stats.totalEnRetard }}</h3>
              <p class="stat-card-label">En retard</p>
            </div>
            <div class="stat-card-icon">
              <i class="fas fa-exclamation-circle"></i>
            </div>
          </div>
          <div class="stat-card-footer">
            <span>Nécessite une action</span>
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

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .stat-card-content {
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .stat-card-value {
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        line-height: 1;
      }

      .stat-card-label {
        color: var(--gray-600);
        margin-bottom: 0.5rem;
      }

      .stat-card-amount {
        font-size: 1.1rem;
        font-weight: 500;
      }

      .stat-card-icon {
        font-size: 2rem;
        opacity: 0.8;
      }

      .stat-card-footer {
        padding: 1rem 1.5rem;
        background: var(--gray-50);
        border-top: 1px solid var(--gray-100);
        color: var(--gray-600);
        font-size: 0.875rem;
      }

      .primary-card {
        color: var(--primary);
      }
      .success-card {
        color: var(--success);
      }
      .warning-card {
        color: var(--warning);
      }
      .danger-card {
        color: var(--danger);
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
    this.factureService.getStatistiques().subscribe(
      (stats) => {
        this.stats = stats;
      },
      (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    );
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
