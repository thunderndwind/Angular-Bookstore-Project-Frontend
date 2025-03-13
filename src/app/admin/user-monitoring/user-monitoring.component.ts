import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin/admin.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-monitoring.component.html',
  styleUrls: ['./user-monitoring.component.css']
})
export class UserMonitoringComponent implements OnInit, OnDestroy {
  onlineUsers: any[] = [];
  selectedUser: any = null;
  userConnections: any[] = [];
  userHistory: any = null;
  
  isLoading: boolean = false;
  error: string | null = null;
  
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  detailed: boolean = false;
  
  refreshInterval: Subscription | null = null;
  autoRefresh: boolean = true;
  
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadOnlineUsers();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      this.refreshInterval.unsubscribe();
    }
  }

  setupAutoRefresh(): void {
    if (this.autoRefresh) {
      this.refreshInterval = interval(30000) // refresh every 30 seconds
        .pipe(
          switchMap(() => this.adminService.getOnlineUsers(this.currentPage, this.limit, this.detailed))
        )
        .subscribe({
          next: (response) => {
            this.onlineUsers = response.users;
            this.totalPages = response.pagination.pages;
          },
          error: (err) => {
            console.error('Error refreshing online users:', err);
          }
        });
    } else if (this.refreshInterval) {
      this.refreshInterval.unsubscribe();
      this.refreshInterval = null;
    }
  }

  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    this.setupAutoRefresh();
  }

  loadOnlineUsers(): void {
    this.isLoading = true;
    this.error = null;
    
    this.adminService.getOnlineUsers(this.currentPage, this.limit, this.detailed).subscribe({
      next: (response) => {
        this.onlineUsers = response.users;
        this.totalPages = response.pagination.pages;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load online users';
        this.isLoading = false;
        console.error('Error loading online users:', err);
      }
    });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadOnlineUsers();
  }

  viewUserDetails(user: any): void {
    this.selectedUser = user;
    this.loadUserConnections(user.userId);
    this.loadUserHistory(user.userId);
  }

  loadUserConnections(userId: string): void {
    this.isLoading = true;
    
    this.adminService.getUserConnections(userId, true).subscribe({
      next: (connections) => {
        this.userConnections = connections;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user connections';
        this.isLoading = false;
        console.error('Error loading user connections:', err);
      }
    });
  }

  loadUserHistory(userId: string): void {
    this.isLoading = true;
    
    this.adminService.getUserActivityHistory(userId).subscribe({
      next: (history) => {
        this.userHistory = history;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user history';
        this.isLoading = false;
        console.error('Error loading user history:', err);
      }
    });
  }

  disconnectUser(userId: string, socketId: string): void {
    if (confirm('Are you sure you want to disconnect this user session?')) {
      this.isLoading = true;
      
      this.adminService.disconnectUser(userId, socketId).subscribe({
        next: () => {
          this.loadUserConnections(userId);
          this.loadOnlineUsers();
        },
        error: (err) => {
          this.error = 'Failed to disconnect user';
          this.isLoading = false;
          console.error('Error disconnecting user:', err);
        }
      });
    }
  }

  disconnectAllSessions(userId: string): void {
    if (confirm('Are you sure you want to disconnect all sessions for this user?')) {
      this.isLoading = true;
      
      this.adminService.disconnectAllUserInstances(userId).subscribe({
        next: () => {
          this.selectedUser = null;
          this.loadOnlineUsers();
        },
        error: (err) => {
          this.error = 'Failed to disconnect all user sessions';
          this.isLoading = false;
          console.error('Error disconnecting all user sessions:', err);
        }
      });
    }
  }

  closeUserDetails(): void {
    this.selectedUser = null;
    this.userConnections = [];
    this.userHistory = null;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'online': return 'text-success';
      case 'away': return 'text-warning';
      case 'busy': return 'text-danger';
      default: return 'text-secondary';
    }
  }
}