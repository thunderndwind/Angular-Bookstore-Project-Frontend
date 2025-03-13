// src/app/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class adminGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router,
    private http: HttpClient
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    return this.http.get<any>('http://localhost:5000/admin/books', {
      headers: {
        Authorization: `Bearer ${this.authService.getAccessToken()}`
      }
    }).pipe(
      map(() => true),
      catchError(error => {
        if (error.status === 403) {
          this.router.navigate(['/forbidden']);
          console.error('Forbidden');
        } else {
          console.error('Error:', error);
          this.router.navigate(['/login']);
        }
        return of(false);
      })
    );
  }
}