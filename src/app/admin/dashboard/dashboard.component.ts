import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin/admin.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [CommonModule, RouterLink],
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalBooks: number = 0;
  totalUsers: number = 0;
  totalOrders: number = 0;
  totalRevenue: number = 0;
  systemHealth: string = 'Good';
  isLoading: boolean = true;
  error: string | null = null;
  
  // Recent orders
  recentOrders: any[] = [];
  
  // System metrics
  cpuUsage: number = 0;
  memoryUsage: number = 0;
  lastChecked: Date = new Date();

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    this.error = null;
    
    this.adminService.getDashboardStats().subscribe({
      next: (response) => {
        this.totalBooks = response.totalBooks || 0;
        this.totalUsers = response.totalUsers || 0;
        this.totalOrders = response.totalOrders || 0;
        this.totalRevenue = response.totalRevenue || 0;
        this.recentOrders = response.recentOrders || [];
        
        // System metrics
        this.cpuUsage = response.systemMetrics?.cpuUsage || 0;
        this.memoryUsage = response.systemMetrics?.memoryUsage || 0;
        this.systemHealth = this.determineSystemHealth(this.cpuUsage, this.memoryUsage);
        this.lastChecked = new Date();
        
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard data';
        this.isLoading = false;
        console.error('Error loading dashboard data:', err);
      }
    });
  }

  determineSystemHealth(cpu: number, memory: number): string {
    if (cpu >= 80 || memory >= 80) {
      return 'Critical';
    } else if (cpu >= 50 || memory >= 50) {
      return 'Warning';
    } else {
      return 'Good';
    }
  }

  refreshData() {
    this.loadDashboardData();
  }
}