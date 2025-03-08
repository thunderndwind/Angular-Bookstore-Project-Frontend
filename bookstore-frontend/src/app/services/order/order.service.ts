import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000'; //nodejs server

  constructor(private http: HttpClient) {}

  getUserOrders(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/order/order-history/${userId}`);
  }
}
