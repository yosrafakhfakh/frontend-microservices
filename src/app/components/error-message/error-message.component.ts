import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="alert alert-danger alert-dismissible fade show"
      role="alert"
      *ngIf="message"
    >
      <i class="fas fa-exclamation-circle me-2"></i>
      {{ message }}
      <button
        type="button"
        class="btn-close"
        (click)="retry.emit()"
        *ngIf="showRetry"
      ></button>
    </div>
  `,
})
export class ErrorMessageComponent {
  @Input() message = '';
  @Input() showRetry = false;
  @Output() retry = new EventEmitter<void>();
}
