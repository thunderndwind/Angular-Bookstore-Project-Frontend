import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin/admin.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AdminSocketService } from '../../services/admin/admin-socket.service';

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
  success: string | null = null; // Add missing success property
  
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  detailed: boolean = false;
  
  refreshInterval: Subscription | null = null;
  autoRefresh: boolean = true;
  
  // Add missing subscriptions property
  private subscriptions = new Subscription();
  
  constructor(
    private adminService: AdminService,
    private adminSocketService: AdminSocketService
  ) { }

  ngOnInit(): void {
    // Connect to WebSocket for real-time updates
    this.adminSocketService.connect();
    
    // Subscribe to user connection events
    this.subscriptions.add(
      this.adminSocketService.onUserConnection().subscribe(event => {
        if (event.event === 'connected') {
          this.handleUserConnected(event);
        } else if (event.event === 'disconnected') {
          this.handleUserDisconnected(event);
        }
      })
    );
    
    // Load initial data
    this.loadOnlineUsers();
    
    // Set up polling for updates
    this.startPolling();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions and polling
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
    
    this.subscriptions.unsubscribe();
    
    // Disconnect from WebSocket
    this.adminSocketService.disconnect();
  }

  setupAutoRefresh(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
    
    if (this.autoRefresh) {
      this.pollingSubscription = interval(30000) // refresh every 30 seconds
        .pipe(
          switchMap(() => this.adminService.getOnlineUsers({page: this.currentPage, limit:this.limit, detailed:this.detailed}))
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
    }
  }

  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    this.setupAutoRefresh();
  }

  loadOnlineUsers(): void {
    this.isLoading = true;
    this.error = null;
    
    this.adminService.getOnlineUsers({page: this.currentPage, limit:this.limit, detailed:this.detailed}).subscribe({
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
    if (!confirm('Are you sure you want to disconnect this user?')) {
      return;
    }
    
    this.isLoading = true;
    this.adminService.disconnectUser(userId, socketId).subscribe({
      next: (response) => {
        this.success = 'User disconnected successfully';
        this.loadOnlineUsers(); // Refresh the list
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to disconnect user';
        this.isLoading = false;
        console.error('Error disconnecting user:', err);
      }
    });
  }

  private handleUserConnected(event: any): void {
    // Update the list when a user connects
    this.loadOnlineUsers();
  }

  private handleUserDisconnected(event: any): void {
    // Update the list when a user disconnects
    this.loadOnlineUsers();
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

  // Use only one subscription for polling
  private pollingSubscription: Subscription | null = null;
  
  startPolling(): void {
    if (this.autoRefresh) {
      this.setupAutoRefresh();
    }
  }
}