import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000';
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);

  cartItems$ = this.cartItemsSubject.asObservable();
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartCount();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  loadCartCount(): void {
    this.getCartCount().subscribe({
      next: (response) => {
        this.cartCountSubject.next(response.cartSize);
      },
      error: (error) => {
        console.error('Error loading cart count:', error);
      }
    });
  }

  getCart(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart`, { headers: this.getHeaders() })
      .pipe(
        tap((response: any) => {
          this.cartItemsSubject.next(response.cartItems);
          this.cartCountSubject.next(response.totalItems);
        })
      );
  }

  getCartCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart/count`, { headers: this.getHeaders() });
  }

  addToCart(bookId: string, quantity: number = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/add`, { bookId, quantity }, { headers: this.getHeaders() })
      .pipe(
        tap((response: any) => {
          this.cartCountSubject.next(response.cartSize);
        })
      );
  }

  updateCartItem(bookId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/cart/update`, { bookId, quantity }, { headers: this.getHeaders() })
      .pipe(
        tap((response: any) => {
          this.cartCountSubject.next(response.cartSize);
          this.getCart().subscribe();
        })
      );
  }

  removeFromCart(bookId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/remove/${bookId}`, { headers: this.getHeaders() })
      .pipe(
        tap((response: any) => {
          this.cartCountSubject.next(response.cartSize);
          this.getCart().subscribe();
        })
      );
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/clear`, { headers: this.getHeaders() })
      .pipe(
        tap((response: any) => {
          this.cartCountSubject.next(0);
          this.cartItemsSubject.next([]);
        })
      );
  }
}