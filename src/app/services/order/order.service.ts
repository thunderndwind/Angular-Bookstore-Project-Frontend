import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'https://celeste-fbd25ae57588.herokuapp.com'; // Node.js server

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserOrders(page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    const userId = this.authService.getCurrentUserId();
    return this.http.get(`${this.apiUrl}/order/user/${userId}`, { params });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createOrder(cartItems: any[], total_price: number): Observable<any> {
    const userId = this.authService.getCurrentUserId();
    const transformedBooks = cartItems.map(item => ({
      bookId: item.book._id,
      quantity: item.quantity
    }));

    return this.http.post(`${this.apiUrl}/order`, {
      user: userId,
      books: transformedBooks,
      total_price,
      payment_method: 'card'
    }, { headers: this.getHeaders() });
  }
}