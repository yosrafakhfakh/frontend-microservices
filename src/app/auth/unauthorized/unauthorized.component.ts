import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-5">
      <div class="card text-center">
        <div class="card-body">
          <h1 class="text-danger mb-4">
            <i class="fas fa-exclamation-triangle"></i>
          </h1>
          <h2 class="card-title mb-4">Accès non autorisé</h2>
          <p class="card-text mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette
            page.
          </p>
          <a routerLink="/accueil" class="btn btn-primary">
            <i class="fas fa-home me-2"></i>Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        max-width: 500px;
        margin: 0 auto;
        box-shadow: var(--shadow);
      }
      .fas.fa-exclamation-triangle {
        font-size: 3rem;
      }
    `,
  ],
})
export class UnauthorizedComponent {}
