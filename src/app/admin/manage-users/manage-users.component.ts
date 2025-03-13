import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin/admin.service';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent {
  users: any[] = [];
  filteredUsers: any[] = [];

  isLoading: boolean = false;
  error: string | null = null;
  success: string | null = null;

  searchTerm: string = '';
  roleFilter: string = 'all';

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;

    this.adminService.getUsers().subscribe({
      next: (response) => {
        this.users = response.users || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.isLoading = false;
        console.error('Error loading users:', err);
      }
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      if (this.roleFilter !== 'all' && user.role !== this.roleFilter) {
        return false;
      }

      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        return (
          user.firstName?.toLowerCase().includes(term) ||
          user.lastName?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.userName?.toLowerCase().includes(term)
        );
      }

      return true;
    });
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.isLoading = true;

      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.success = 'User deleted successfully';
          this.loadUsers();
        },
        error: (err) => {
          this.error = 'Failed to delete user';
          this.isLoading = false;
          console.error('Error deleting user:', err);
        }
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
}