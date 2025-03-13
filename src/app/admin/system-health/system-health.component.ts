// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AdminService } from '../../services/admin/admin.service';
// import { interval, Subscription } from 'rxjs';

// @Component({
//   selector: 'app-system-health',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './system-health.component.html',
//   styleUrls: ['./system-health.component.css']
// })
// export class SystemHealthComponent {
//   systemHealth: any = null;
//   connectionSummary: any = null;
//   userStats: any = null;

//   isLoading: boolean = false;
//   error: string | null = null;

//   refreshInterval: Subscription | null = null;
//   autoRefresh: boolean = true;

//   objectKeys = Object.keys;

//   getStatusClass(status: string): string {
//     const classes: { [key: string]: string } = {
//       online: 'bg-success',
//       away: 'bg-warning',
//       busy: 'bg-danger',
//       offline: 'bg-secondary'
//     };
//     return classes[status] || 'bg-info';
//   }

//   constructor(private adminService: AdminService) { }

//   ngOnInit(): void {
//     this.loadSystemData();
//     this.setupAutoRefresh();
//   }

//   ngOnDestroy(): void {
//     if (this.refreshInterval) {
//       this.refreshInterval.unsubscribe();
//     }
//   }

//   setupAutoRefresh(): void {
//     if (this.autoRefresh) {
//       this.refreshInterval = interval(60000)
//         .subscribe(() => {
//           this.loadSystemData();
//         });
//     } else if (this.refreshInterval) {
//       this.refreshInterval.unsubscribe();
//       this.refreshInterval = null;
//     }
//   }

//   toggleAutoRefresh(): void {
//     this.autoRefresh = !this.autoRefresh;
//     this.setupAutoRefresh();
//   }

//   loadSystemData(): void {
//     this.isLoading = true;
//     this.error = null;


//     this.adminService.getSystemHealth().subscribe({
//       next: (data) => {
//         this.systemHealth = data;
//         this.isLoading = false;
//       },
//       error: (err) => {
//         this.error = 'Failed to load system health data';
//         this.isLoading = false;
//         console.error('Error loading system health:', err);
//       }
//     });


//     this.adminService.getConnectionsSummary().subscribe({
//       next: (data) => {
//         this.connectionSummary = data;
//       },
//       error: (err) => {
//         console.error('Error loading connection summary:', err);
//       }
//     });


//     this.adminService.getUserActivityStats().subscribe({
//       next: (data) => {
//         this.userStats = data;
//       },
//       error: (err) => {
//         console.error('Error loading user stats:', err);
//       }
//     });
//   }

//   formatBytes(bytes: number): string {
//     if (bytes === 0) return '0 Bytes';

//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));

//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   }

//   formatUptime(seconds: number): string {
//     const days = Math.floor(seconds / (3600 * 24));
//     const hours = Math.floor((seconds % (3600 * 24)) / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);

//     return `${days}d ${hours}h ${minutes}m`;
//   }

//   getMemoryUsagePercentage(): number {
//     if (!this.systemHealth) return 0;
//     return (this.systemHealth.memory.used / this.systemHealth.memory.total) * 100;
//   }

//   getCpuUsageClass(usage: number): string {
//     if (usage > 80) return 'bg-danger';
//     if (usage > 60) return 'bg-warning';
//     return 'bg-success';
//   }

//   getMemoryUsageClass(usage: number): string {
//     if (usage > 80) return 'bg-danger';
//     if (usage > 60) return 'bg-warning';
//     return 'bg-success';
//   }
// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin/admin.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-system-health',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './system-health.component.html',
  styleUrls: ['./system-health.component.css'],
})
export class SystemHealthComponent {
  systemHealth: any = null;
  connectionSummary: any = null;
  userStats: any = null;

  isLoading: boolean = false;
  error: string | null = null;

  refreshInterval: Subscription | null = null;
  autoRefresh: boolean = true;

  objectKeys = Object.keys;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadSystemData();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      this.refreshInterval.unsubscribe();
    }
  }

  setupAutoRefresh(): void {
    if (this.autoRefresh) {
      this.refreshInterval = interval(60000).subscribe(() => {
        this.loadSystemData();
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

  loadSystemData(): void {
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
      },
    });

    this.adminService.getConnectionsSummary().subscribe({
      next: (data) => {
        this.connectionSummary = data;
      },
      error: (err) => {
        console.error('Error loading connection summary:', err);
      },
    });

    this.adminService.getUserActivityStats().subscribe({
      next: (data) => {
        this.userStats = data;
      },
      error: (err) => {
        console.error('Error loading user stats:', err);
      },
    });
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
    if (!this.systemHealth) return 0;
    return (this.systemHealth.memory.used / this.systemHealth.memory.total) * 100;
  }

  getCpuUsagePercentage(): number {
    if (!this.systemHealth || !this.systemHealth.cpu) return 0;
    return parseFloat(this.systemHealth.cpu.usage);
  }

  getCpuUsageClass(usage: number): string {
    if (usage > 80) return 'bg-danger';
    if (usage > 60) return 'bg-warning';
    return 'bg-success';
  }

  getMemoryUsageClass(usage: number): string {
    if (usage > 80) return 'bg-danger';
    if (usage > 60) return 'bg-warning';
    return 'bg-success';
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      online: 'bg-success',
      away: 'bg-warning',
      busy: 'bg-danger',
      offline: 'bg-secondary',
    };
    return classes[status] || 'bg-info';
  }
}