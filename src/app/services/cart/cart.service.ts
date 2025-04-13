import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://celeste-fbd25ae57588.herokuapp.com';
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);

  cartItems$ = this.cartItemsSubject.asObservable();
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    if (this.authService.isLoggedIn()) {
      this.loadCartCount();
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  loadCartCount(): void {
    if (!this.authService.isLoggedIn()) {
      this.cartCountSubject.next(0);
      return;
    }

    this.getCartCount().subscribe({
      next: (response) => {
        this.cartCountSubject.next(response.cartSize);
      },
      error: (error) => {
        console.error('Error loading cart count:', error);
        this.cartCountSubject.next(0);
      }
    });
  }

  getCart(): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return new Observable(observer => {
        observer.next({ cartItems: [], totalItems: 0 });
        observer.complete();
      });
    }

    return this.http.get(`${this.apiUrl}/cart`, { headers: this.getHeaders() })
      .pipe(
        tap((response: any) => {
          this.cartItemsSubject.next(response.cartItems);
          this.cartCountSubject.next(response.totalItems);
        })
      );
  }

  getCartCount(): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return new Observable(observer => {
        observer.next({ cartSize: 0 });
        observer.complete();
      });
    }

    return this.http.get(`${this.apiUrl}/cart/count`, { headers: this.getHeaders() });
  }

  addToCart(bookId: string, quantity: number = 1): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return new Observable(observer => {
        observer.next({ cartSize: 0 });
        observer.complete();
      });
    }

    return this.http.post(`${this.apiUrl}/cart/add`, { bookId, quantity }, { headers: this.getHeaders() })
      .pipe(
        tap((response: any) => {
          this.cartCountSubject.next(response.cartSize);
        })
      );
  }

  updateCartItem(bookId: string, quantity: number): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return new Observable(observer => {
        observer.next({ cartSize: 0 });
        observer.complete();
      });
    }

    return this.http.put(`${this.apiUrl}/cart/update`, { bookId, quantity }, { headers: this.getHeaders() })
      .pipe(
        tap((response: any) => {
          this.cartCountSubject.next(response.cartSize);
          this.getCart().subscribe();
        })
      );
  }

  removeFromCart(bookId: string): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return new Observable(observer => {
        observer.next({ cartSize: 0 });
        observer.complete();
      });
    }

    return this.http.delete(`${this.apiUrl}/cart/remove/${bookId}`, { headers: this.getHeaders() })
      .pipe(
        tap((response: any) => {
          this.cartCountSubject.next(response.cartSize);
          this.getCart().subscribe();
        })
      );
  }

  clearCart(): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return new Observable(observer => {
        observer.next({ cartSize: 0 });
        observer.complete();
      });
    }

    return this.http.delete(`${this.apiUrl}/cart/clear`, { headers: this.getHeaders() })
      .pipe(
        tap((response: any) => {
          this.cartCountSubject.next(0);
          this.cartItemsSubject.next([]);
        })
      );
  }
}