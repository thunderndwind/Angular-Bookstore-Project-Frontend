import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin/admin.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  userId: string = '';
  userForm: FormGroup;
  
  isLoading: boolean = false;
  isSaving: boolean = false;
  error: string | null = null;
  success: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      role: ['user', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.userId) {
      this.loadUserDetails();
    } else {
      this.error = 'User ID is required';
    }
  }

  loadUserDetails(): void {
    this.isLoading = true;
    
    this.adminService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userName: user.userName,
          role: user.role,
          isActive: user.isActive
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user details';
        this.isLoading = false;
        console.error('Error loading user details:', err);
      }
    });
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.error = null;
    this.success = null;
    
    this.adminService.updateUser(this.userId, this.userForm.value).subscribe({
      next: () => {
        this.success = 'User updated successfully';
        this.isSaving = false;
      },
      error: (err) => {
        this.error = 'Failed to update user';
        this.isSaving = false;
        console.error('Error updating user:', err);
      }
    });
  }



  goBack(): void {
    this.router.navigate(['/admin/users']);
  }
}