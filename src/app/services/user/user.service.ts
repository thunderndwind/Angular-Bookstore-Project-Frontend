import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000'; //nodejs server

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUser(): Observable<any> {
    const userId = this.authService.getCurrentUserId(); 
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${id}`, userData);
  }
}