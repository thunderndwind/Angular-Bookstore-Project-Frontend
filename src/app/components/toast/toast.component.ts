import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast } from '../../interfaces/toast';
import { NotificationService } from '../../services/notification/notification.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class ToastComponent {
  toasts = signal<Toast[]>([]);
  constructor(private toastService: NotificationService) { }

  ngOnInit() {
    this.toastService.getToasts().subscribe(toast => {
      console.log(toast);

      if (toast) {
        const toastWithId = { ...toast, id: Date.now() };
        this.toasts.update(currentToasts => [...currentToasts, toastWithId]);

        setTimeout(() => {
          this.removeToast(toastWithId);
        }, toast.duration || 2000);
      }
    });
  }

  removeToast(toastToRemove: Toast) {
    this.toasts.update(currentToasts =>
      currentToasts.filter(t => t.id !== toastToRemove.id)
    );
  }

  getToastClass(type: string): string {
    switch (type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      case 'info':
        return 'toast-info';
      case 'warning':
        return 'toast-warning';
      default:
        return 'toast-info';
    }
  }
}
