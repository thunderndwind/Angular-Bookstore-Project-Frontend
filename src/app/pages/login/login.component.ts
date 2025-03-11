import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { RouterLink, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
})
export class LoginComponent {
  errorMessage: string = '';
  email: string = "";
  password: string = "";

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async login() {
    this.errorMessage = '';
  
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }
  
    try {
      const res = await this.authService.login(this.email, this.password);
      console.log('Login response:', res);
  
      if (res.accessToken && res.refreshToken) {
        console.log('Tokens received. Redirecting to home...'); // Debug: Log redirection
        this.router.navigate(['/']); // Redirect to home page
      } else {
        this.errorMessage = res.message || 'Invalid credentials';
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage = "Login failed. Please try again.";
    }
  }

  googleLogin() {
    this.authService.googleLogin();
  }
}