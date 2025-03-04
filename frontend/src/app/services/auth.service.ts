import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:5000/api/auth";

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, {
      email,
      password,
    });
  }

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password });
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("token");
  }
}
