import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin/admin.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-system-health',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-health.component.html',
  styleUrls: ['./system-health.component.css']
})
export class SystemHealthComponent implements OnInit, OnDestroy {
  systemHealth: any = null;
  isLoading: boolean = true;
  error: string | null = null;
  
  refreshInterval: number = 30000; // 30 seconds
  private refreshSubscription?: Subscription;
  
  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadSystemHealth();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  loadSystemHealth(): void {
    this.isLoading = true;
    this.error = null;
    
    this.adminService.getSystemHealth().subscribe({
      next: (data) => {
        this.systemHealth = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load system health data';
        this.isLoading = false;
        console.error('Error loading system health:', err);
      }
    });
  }

  startAutoRefresh(): void {
    this.refreshSubscription = interval(this.refreshInterval)
      .pipe(
        switchMap(() => this.adminService.getSystemHealth())
      )
      .subscribe({
        next: (data) => {
          this.systemHealth = data;
        },
        error: (err) => {
          console.error('Error refreshing system health:', err);
        }
      });
  }

  stopAutoRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  refreshData(): void {
    this.loadSystemHealth();
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatUptime(seconds: number): string {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  }

  getMemoryUsagePercentage(): number {
    if (!this.systemHealth || !this.systemHealth.memory) return 0;
    return (this.systemHealth.memory.used / this.systemHealth.memory.total) * 100;
  }

  getStatusClass(value: number, thresholds: { warning: number, danger: number }): string {
    if (value >= thresholds.danger) return 'text-danger';
    if (value >= thresholds.warning) return 'text-warning';
    return 'text-success';
  }
}