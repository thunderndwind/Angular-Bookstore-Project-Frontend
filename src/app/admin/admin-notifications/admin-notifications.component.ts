import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin/admin.service';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-notifications.component.html',
  styleUrls: ['./admin-notifications.component.css']
})
export class AdminNotificationsComponent {
  onlineUsers: any[] = [];
  selectedUsers: string[] = [];

  notificationMessage: string = '';
  notificationType: string = 'info';

  isLoading: boolean = false;
  isSending: boolean = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadOnlineUsers();
  }

  loadOnlineUsers(): void {
    this.isLoading = true;
    this.error = null;

    this.adminService.getOnlineUsers(1, 100, false).subscribe({
      next: (response) => {
        this.onlineUsers = response.users;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load online users';
        this.isLoading = false;
        console.error('Error loading online users:', err);
      }
    });
  }

  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedUsers = this.onlineUsers.map(user => user.userId);
    } else {
      this.selectedUsers = [];
    }
  }

  isAllSelected(): boolean {
    return this.selectedUsers.length === this.onlineUsers.length;
  }

  toggleUserSelection(userId: string): void {
    const index = this.selectedUsers.indexOf(userId);
    if (index === -1) {
      this.selectedUsers.push(userId);
    } else {
      this.selectedUsers.splice(index, 1);
    }
  }

  isSelected(userId: string): boolean {
    return this.selectedUsers.includes(userId);
  }

  sendNotification(): void {
    if (!this.notificationMessage.trim()) {
      this.error = 'Please enter a notification message';
      return;
    }

    if (this.selectedUsers.length === 0) {
      this.error = 'Please select at least one user';
      return;
    }

    this.isSending = true;
    this.error = null;
    this.success = null;

    this.adminService.sendAdminNotification(
      this.selectedUsers,
      this.notificationMessage,
      this.notificationType
    ).subscribe({
      next: () => {
        this.success = 'Notification sent successfully';
        this.isSending = false;
        this.notificationMessage = '';
      },
      error: (err) => {
        this.error = 'Failed to send notification';
        this.isSending = false;
        console.error('Error sending notification:', err);
      }
    });
  }

  broadcastMessage(): void {
    if (!this.notificationMessage.trim()) {
      this.error = 'Please enter a broadcast message';
      return;
    }

    if (!confirm('Are you sure you want to broadcast this message to ALL users?')) {
      return;
    }

    this.isSending = true;
    this.error = null;
    this.success = null;

    this.adminService.broadcastSystemMessage(
      this.notificationMessage,
      this.notificationType
    ).subscribe({
      next: () => {
        this.success = 'Broadcast message sent successfully';
        this.isSending = false;
        this.notificationMessage = '';
      },
      error: (err) => {
        this.error = 'Failed to send broadcast message';
        this.isSending = false;
        console.error('Error sending broadcast message:', err);
      }
    });
  }
}