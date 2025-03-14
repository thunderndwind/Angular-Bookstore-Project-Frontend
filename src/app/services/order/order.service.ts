import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:5000'; // Node.js server

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserOrders( page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
      const userId = this.authService.getCurrentUserId(); 
    return this.http.get(`${this.apiUrl}/order/user/${userId}`, { params });
  }
}