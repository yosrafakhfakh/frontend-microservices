import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid px-4">
          <!-- Logo -->
          <a
            class="navbar-brand d-flex align-items-center"
            routerLink="/dashboard"
          >
            <div class="brand-wrapper">
              <i class="fas fa-chart-line brand-icon"></i>
              <span class="brand-text">GestionPro</span>
            </div>
          </a>

          <!-- Bouton toggle pour mobile -->
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
          >
            <i class="fas fa-bars"></i>
          </button>

          <!-- Navigation principale -->
          <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/dashboard"
                  routerLinkActive="active"
                >
                  <i class="fas fa-home me-2"></i>Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/produits"
                  routerLinkActive="active"
                >
                  <i class="fas fa-box me-2"></i>Produits
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/factures"
                  routerLinkActive="active"
                >
                  <i class="fas fa-file-invoice me-2"></i>Factures
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/reglements"
                  routerLinkActive="active"
                >
                  <i class="fas fa-money-bill-wave me-2"></i>Règlements
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/clients"
                  routerLinkActive="active"
                >
                  <i class="fas fa-users me-2"></i>Clients
                </a>
              </li>
            </ul>

            <!-- Actions rapides -->
            <div class="d-flex align-items-center gap-3">
              <!-- Recherche -->
              <div class="search-box">
                <i class="fas fa-search search-icon"></i>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Rechercher..."
                />
              </div>

              <!-- Notifications -->
              <div class="nav-item dropdown">
                <a class="nav-link position-relative" data-bs-toggle="dropdown">
                  <i class="fas fa-bell"></i>
                  <span class="notification-badge">3</span>
                </a>
                <div
                  class="dropdown-menu dropdown-menu-end notifications-dropdown"
                >
                  <h6 class="dropdown-header">Notifications</h6>
                  <div class="notification-item">
                    <i class="fas fa-file-invoice text-primary"></i>
                    <div class="notification-content">
                      <div class="notification-title">Nouvelle facture</div>
                      <div class="notification-text">Facture #123 créée</div>
                    </div>
                  </div>
                  <!-- Autres notifications... -->
                </div>
              </div>

              <!-- Profil utilisateur -->
              <div class="nav-item dropdown user-dropdown" *ngIf="currentUser">
                <a
                  class="nav-link d-flex align-items-center gap-2"
                  data-bs-toggle="dropdown"
                >
                  <div class="user-avatar">
                    <i class="fas fa-user"></i>
                  </div>
                  <div class="user-info d-none d-md-block">
                    <div class="user-name">{{ currentUser.username }}</div>
                    <div class="user-role">{{ currentUser.roles[0] }}</div>
                  </div>
                </a>
                <div class="dropdown-menu dropdown-menu-end">
                  <div class="dropdown-header">
                    <div class="d-flex align-items-center">
                      <div class="user-avatar-sm">
                        <i class="fas fa-user"></i>
                      </div>
                      <div class="ms-2">
                        <div class="fw-bold">{{ currentUser.username }}</div>
                        <div class="small text-muted">
                          {{ currentUser.roles[0] }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" routerLink="/profile">
                    <i class="fas fa-user-cog me-2"></i>Mon Profil
                  </a>
                  <a class="dropdown-item" routerLink="/parametres">
                    <i class="fas fa-cog me-2"></i>Paramètres
                  </a>
                  <div class="dropdown-divider"></div>
                  <a
                    class="dropdown-item text-danger"
                    href="#"
                    (click)="logout($event)"
                  >
                    <i class="fas fa-sign-out-alt me-2"></i>Déconnexion
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [
    `
      .header {
        background: var(--primary);
        box-shadow: var(--shadow);
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .navbar {
        height: 70px;
      }

      .brand-icon {
        font-size: 24px;
        color: white;
        margin-right: 10px;
      }

      .brand-text {
        font-size: 20px;
        font-weight: 600;
        color: white;
      }

      .navbar-nav .nav-link {
        padding: 0.75rem 1rem;
        color: rgba(255, 255, 255, 0.9) !important;
        font-weight: 500;
        transition: all 0.2s;
        border-radius: var(--radius-sm);
        margin: 0 0.25rem;
      }

      .navbar-nav .nav-link:hover {
        color: white !important;
        background-color: rgba(255, 255, 255, 0.1);
      }

      .navbar-nav .nav-link.active {
        color: white !important;
        background-color: rgba(255, 255, 255, 0.15);
      }

      .navbar-nav .nav-link i {
        font-size: 1rem;
        width: 20px;
        text-align: center;
      }

      .search-box {
        position: relative;
        width: 250px;
      }

      .search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: rgba(255, 255, 255, 0.7);
      }

      .search-box .form-control {
        padding-left: 35px;
        background-color: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
      }

      .search-box .form-control::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }

      .search-box .form-control:focus {
        background-color: rgba(255, 255, 255, 0.2);
        box-shadow: none;
      }

      .notification-badge {
        position: absolute;
        top: 0;
        right: -5px;
        background: var(--danger);
        color: white;
        font-size: 10px;
        padding: 2px 5px;
        border-radius: 10px;
      }

      .user-dropdown .nav-link {
        padding: 5px;
        color: white !important;
      }

      .user-avatar {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .user-avatar-sm {
        width: 32px;
        height: 32px;
        background: var(--primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
      }

      .user-info {
        margin-left: 10px;
      }

      .user-name {
        font-size: 14px;
        font-weight: 500;
        color: white;
        margin-bottom: 2px;
      }

      .user-role {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
      }

      .dropdown-menu {
        border: none;
        box-shadow: var(--shadow-lg);
        border-radius: 8px;
        padding: 0.5rem;
        min-width: 240px;
        margin-top: 10px;
      }

      .dropdown-header {
        padding: 0.75rem;
        background: var(--gray-100);
        border-radius: 6px;
        margin-bottom: 0.5rem;
      }

      .dropdown-item {
        padding: 0.75rem;
        border-radius: 6px;
        font-size: 14px;
        color: var(--gray-700);
        transition: all 0.2s;
      }

      .dropdown-item:hover {
        background: var(--primary-light);
        color: white;
      }

      .dropdown-item.text-danger:hover {
        background: var(--danger);
        color: white !important;
      }

      @media (max-width: 991.98px) {
        .navbar-collapse {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          background: var(--primary);
          padding: 1rem;
          box-shadow: var(--shadow);
        }

        .navbar-nav {
          flex-direction: column;
        }

        .navbar-nav .nav-link {
          padding: 0.75rem 1rem;
          width: 100%;
        }

        .search-box {
          width: 100%;
          margin: 1rem 0;
        }
      }
    `,
  ],
})
export class HeaderComponent implements OnInit {
  currentUser: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
  }
}
