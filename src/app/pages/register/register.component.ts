import { Component } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  fName = "";
  lName = "";
  uName = "";
  email = "";
  password = "";
  confirmPassword = "";
  errorMessage = "";

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  async register() {

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    try {
      const userData = {
        firstName: this.fName,
        lastName: this.lName,
        userName: this.uName,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword
      };

      const res = await this.authService.register(userData);
      console.log('Registration successful. Please Login');
      this.router.navigate(['/login']);
    } catch (error) {
      this.errorMessage = 'Registration failed. Please try again.';
      console.error('Registration error:', error); // Debug: Log error
    }
  }
}