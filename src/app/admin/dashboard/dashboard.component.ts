import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [RouterOutlet, AdminSidebarComponent, CommonModule],
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalBooks: number = 0;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    this.adminService.getBooks().subscribe({
      next: (response) => {
        this.totalBooks = response.totalBooks || 0;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard data. Please try again.';
        this.isLoading = false;
        console.error('Dashboard error:', err);
      }
    });
  }

  toggleTheme() {
    document.body.classList.toggle('dark-mode');
  }  
}