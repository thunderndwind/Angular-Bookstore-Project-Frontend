import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from "../../services/auth/auth.service";
import { Router } from '@angular/router';
import { CartIconComponent } from '../cart-icon/cart-icon.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, CartIconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isNavbarCollapsed = true;

  constructor(public authService: AuthService, private router: Router) { }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
