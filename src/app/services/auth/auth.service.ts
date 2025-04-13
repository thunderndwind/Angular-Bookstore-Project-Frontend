// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://celeste-fbd25ae57588.herokuapp.com';
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';


  constructor(private http: HttpClient, private router: Router) { }

  async login(email: string, password: string): Promise<any> {
    const response = await fetch(`${this.apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (data.accessToken && data.refreshToken) {
      this.setTokens(data.accessToken, data.refreshToken);
    }

    return data;
  }


  async register(user: any): Promise<any> {
    const response = await fetch(`${this.apiUrl}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword,
      }),
    });

    const data = await response.json();
    if (data.accessToken && data.refreshToken) {
      this.setTokens(data.accessToken, data.refreshToken);
    }

    return data;
  }

  logout(): void {
    this.removeTokens();
    this.router.navigate(['/login']);
  }

  googleLogin(): void {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  getCurrentUserId(): string | null {
    const token = localStorage.getItem('access_token'); // Retrieve the token from storage
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.userId; // Assuming the token contains a `userId` field
    }
    return null;
  }

  getCurrentUserRole() {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role;
    }
    return null;
  }

  isAdmin(): boolean {
    const role = this.getCurrentUserRole();
    return role && role === 'admin';
  }

  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${this.apiUrl}/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.accessToken) {
        localStorage.setItem(this.accessTokenKey, data.accessToken);
        return data.accessToken;
      }

      return null;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.logout();
      return null;
    }
  }
}