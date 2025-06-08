import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-content">
          <div class="header-left">
            <h1>📋 Tableau de bord</h1>
            <p class="subtitle">Vue d'ensemble de vos factures</p>
          </div>
          <div class="header-right">
            <span class="current-date">{{
              currentDate | date : 'EEEE d MMMM yyyy'
            }}</span>
          </div>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-title">Total des factures</div>
            <div class="stat-value">{{ totalFactures }}</div>
            <div class="stat-amount">Montant total: {{ totalMontant }} DT</div>
          </div>
        </div>

        <div class="stat-card paid">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-title">Factures réglées</div>
            <div class="stat-value">{{ facturesReglees.length }}</div>
            <div class="stat-amount">Montant: {{ montantRegle }} DT</div>
            <div class="stat-percent">
              {{ ((facturesReglees.length / totalFactures) * 100).toFixed(0) }}%
            </div>
          </div>
        </div>

        <div class="stat-card unpaid">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <div class="stat-title">Factures non réglées</div>
            <div class="stat-value">{{ facturesNonReglees.length }}</div>
            <div class="stat-amount">Montant: {{ montantNonRegle }} DT</div>
            <div class="stat-percent">
              {{
                ((facturesNonReglees.length / totalFactures) * 100).toFixed(0)
              }}%
            </div>
          </div>
        </div>

        <div class="stat-card products">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <div class="stat-title">Produits</div>
            <div class="stat-value">{{ totalProduits }}</div>
            <div class="stat-amount">En stock</div>
          </div>
        </div>

        <div class="stat-card clients">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-title">Clients</div>
            <div class="stat-value">{{ totalClients }}</div>
            <div class="stat-amount">Actifs</div>
          </div>
        </div>

        <div class="stat-card payments">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <div class="stat-title">Règlements</div>
            <div class="stat-value">{{ totalReglements }}</div>
            <div class="stat-amount">Effectués</div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-header">
            <h3>Distribution des paiements</h3>
            <div class="chart-legend">
              <span class="legend-item">
                <span class="legend-color" style="background: #2e7d32"></span>
                Réglées
              </span>
              <span class="legend-item">
                <span class="legend-color" style="background: #f57c00"></span>
                Non réglées
              </span>
            </div>
          </div>
          <canvas #paymentChart></canvas>
        </div>
        <div class="chart-card">
          <div class="chart-header">
            <h3>Évolution des montants</h3>
            <div class="chart-period">6 derniers mois</div>
          </div>
          <canvas #amountChart></canvas>
        </div>
      </div>

      <!-- Invoices -->
      <div class="invoices-grid">
        <!-- Paid Invoices -->
        <div class="invoice-section">
          <div class="section-header">
            <h2>✅ Factures réglées</h2>
            <div class="section-stats">
              <span>{{ facturesReglees.length }} factures</span>
              <span>{{ montantRegle }} DT</span>
            </div>
          </div>
          <div class="invoice-list">
            <div class="invoice-item" *ngFor="let facture of facturesReglees">
              <div class="invoice-details">
                <div>#{{ facture.numero }}</div>
                <div>{{ facture.client }} - {{ facture.date }}</div>
                <div class="amount">{{ facture.montant }} DT</div>
              </div>
              <div class="status-badge paid">Réglée</div>
            </div>
          </div>
        </div>

        <!-- Unpaid Invoices -->
        <div class="invoice-section">
          <div class="section-header">
            <h2>⏳ Factures non réglées</h2>
            <div class="section-stats">
              <span>{{ facturesNonReglees.length }} factures</span>
              <span>{{ montantNonRegle }} DT</span>
            </div>
          </div>
          <div class="invoice-list">
            <div
              class="invoice-item"
              *ngFor="let facture of facturesNonReglees"
            >
              <div class="invoice-details">
                <div>#{{ facture.numero }}</div>
                <div>{{ facture.client }} - {{ facture.date }}</div>
                <div class="amount">{{ facture.montant }} DT</div>
              </div>
              <div class="status-badge unpaid">En attente</div>
            </div>
          </div>
        </div>

        <!-- Products Section -->
        <div class="invoice-section">
          <div class="section-header">
            <h2>📦 Produits</h2>
            <div class="section-stats">
              <span>{{ totalProduits }} produits</span>
              <span>En stock</span>
            </div>
          </div>
          <div class="stats-list">
            <div class="stat-item">
              <div class="stat-label">Produits actifs</div>
              <div class="stat-value">{{ totalProduits }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Produits vendus</div>
              <div class="stat-value">{{ totalProduits - 20 }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">En rupture</div>
              <div class="stat-value">5</div>
            </div>
          </div>
        </div>

        <!-- Clients Section -->
        <div class="invoice-section">
          <div class="section-header">
            <h2>👥 Clients</h2>
            <div class="section-stats">
              <span>{{ totalClients }} clients</span>
              <span>Actifs</span>
            </div>
          </div>
          <div class="stats-list">
            <div class="stat-item">
              <div class="stat-label">Clients actifs</div>
              <div class="stat-value">{{ totalClients }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Nouveaux clients</div>
              <div class="stat-value">8</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Clients fidèles</div>
              <div class="stat-value">{{ totalClients - 10 }}</div>
            </div>
          </div>
        </div>

        <!-- Payments Section -->
        <div class="invoice-section">
          <div class="section-header">
            <h2>💰 Règlements</h2>
            <div class="section-stats">
              <span>{{ totalReglements }} règlements</span>
              <span>{{ montantRegle }} DT</span>
            </div>
          </div>
          <div class="stats-list">
            <div class="stat-item">
              <div class="stat-label">Règlements effectués</div>
              <div class="stat-value">{{ totalReglements }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">En attente</div>
              <div class="stat-value">{{ facturesNonReglees.length }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Taux de recouvrement</div>
              <div class="stat-value">
                {{ ((totalReglements / totalFactures) * 100).toFixed(0) }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #f8fafc;
        min-height: 100vh;
      }

      .dashboard-container {
        padding: 2rem;
        max-width: 1440px;
        margin: 0 auto;
      }

      .dashboard-header {
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        border-radius: 1.5rem;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        margin-bottom: 2rem;
        border: 1px solid rgba(0, 0, 0, 0.05);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;
      }

      .header-left h1 {
        font-size: 2.5rem;
        margin: 0;
        color: #0f172a;
        font-weight: 700;
        letter-spacing: -0.5px;
      }

      .subtitle {
        color: #64748b;
        font-size: 1.1rem;
        margin-top: 0.5rem;
      }

      .current-date {
        font-size: 1rem;
        color: #334155;
        font-weight: 500;
        background: #f1f5f9;
        padding: 0.75rem 1.25rem;
        border-radius: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: white;
        padding: 1.75rem;
        border-radius: 1.25rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        display: flex;
        gap: 1.25rem;
        transition: all 0.3s ease;
        border: 1px solid rgba(0, 0, 0, 0.05);
        position: relative;
        overflow: hidden;
      }

      .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          45deg,
          transparent,
          rgba(255, 255, 255, 0.1),
          transparent
        );
        transform: translateX(-100%);
        transition: 0.5s;
      }

      .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }

      .stat-card:hover::before {
        transform: translateX(100%);
      }

      .stat-icon {
        font-size: 2rem;
        padding: 1rem;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .stat-card:hover .stat-icon {
        transform: scale(1.1);
      }

      .stat-content {
        flex: 1;
      }

      .stat-title {
        font-size: 0.875rem;
        color: #64748b;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

      .stat-value {
        font-size: 2.25rem;
        font-weight: 700;
        color: #1e293b;
        line-height: 1;
        margin-bottom: 0.5rem;
      }

      .stat-amount,
      .stat-percent {
        font-size: 0.875rem;
        color: #475569;
        font-weight: 500;
      }

      .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .chart-card {
        background: white;
        border-radius: 1.25rem;
        padding: 1.75rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.05);
      }

      .chart-header {
        margin-bottom: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chart-header h3 {
        margin: 0;
        font-size: 1.25rem;
        color: #1e293b;
        font-weight: 600;
      }

      .chart-legend {
        display: flex;
        gap: 1rem;
      }

      .legend-item {
        display: flex;
        align-items: center;
        font-size: 0.85rem;
        color: #475569;
        background: #f8fafc;
        padding: 0.5rem 1rem;
        border-radius: 0.75rem;
      }

      .legend-color {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 0.5rem;
      }

      .invoices-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .invoice-section {
        background: white;
        padding: 1.75rem;
        border-radius: 1.25rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.05);
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #f1f5f9;
      }

      .section-header h2 {
        margin: 0;
        font-size: 1.25rem;
        color: #1e293b;
        font-weight: 600;
      }

      .section-stats {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.25rem;
      }

      .section-stats span {
        font-size: 0.875rem;
        color: #64748b;
        background: #f8fafc;
        padding: 0.25rem 0.75rem;
        border-radius: 0.75rem;
      }

      .stats-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 0.75rem;
        transition: all 0.3s ease;
      }

      .stat-item:hover {
        background: #f1f5f9;
        transform: translateX(5px);
      }

      .stat-label {
        color: #64748b;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .stat-value {
        font-weight: 600;
        color: #1e293b;
        font-size: 1.125rem;
      }

      .invoice-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .invoice-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 0.75rem;
        transition: all 0.3s ease;
      }

      .invoice-item:hover {
        background: #f1f5f9;
        transform: translateX(5px);
      }

      .invoice-details {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .invoice-details div:first-child {
        font-weight: 600;
        color: #1e293b;
      }

      .invoice-details div:nth-child(2) {
        color: #64748b;
        font-size: 0.875rem;
      }

      .amount {
        font-weight: 600;
        color: #1976d2;
      }

      .status-badge {
        font-size: 0.75rem;
        padding: 0.25rem 0.75rem;
        border-radius: 0.5rem;
        font-weight: 600;
      }

      .paid {
        background-color: #d1fae5;
        color: #065f46;
      }

      .unpaid {
        background-color: #fde68a;
        color: #92400e;
      }

      @media (max-width: 768px) {
        .dashboard-container {
          padding: 1rem;
        }

        .header-content {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }

        .charts-grid,
        .stats-grid,
        .invoices-grid {
          grid-template-columns: 1fr;
        }

        .stat-card {
          padding: 1.25rem;
        }

        .stat-value {
          font-size: 1.75rem;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('paymentChart') paymentChartRef!: ElementRef;
  @ViewChild('amountChart') amountChartRef!: ElementRef;

  currentDate = new Date();

  totalFactures = 4;
  totalMontant = 12400;
  totalProduits = 120;
  totalClients = 3;
  totalReglements = 38;

  facturesReglees = [
    { numero: '001', client: 'Mariem', montant: 2000, date: '2024-01-01' },
    { numero: '002', client: 'Mohamed', montant: 1500, date: '2024-01-10' },
  ];
  montantRegle = 3500;

  facturesNonReglees = [
    { numero: '003', client: 'Ali', montant: 3000, date: '2024-01-20' },
  ];
  montantNonRegle = 3000;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const paymentChartCtx = this.paymentChartRef.nativeElement.getContext('2d');
    new Chart(paymentChartCtx, {
      type: 'doughnut',
      data: {
        labels: ['Réglées', 'Non réglées'],
        datasets: [
          {
            data: [this.facturesReglees.length, this.facturesNonReglees.length],
            backgroundColor: ['#2e7d32', '#f57c00'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    const amountChartCtx = this.amountChartRef.nativeElement.getContext('2d');
    new Chart(amountChartCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Montant',
            data: [1000, 1200, 1400, 1600, 2000, 2200],
            borderColor: '#1976d2',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
