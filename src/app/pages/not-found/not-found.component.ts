import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-5 text-center">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <a routerLink="/login" class="btn btn-primary">Go to Login</a>
    </div>
  `,
  styles: []
})
export class NotFoundComponent {}