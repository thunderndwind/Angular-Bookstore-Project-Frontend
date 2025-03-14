import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5000/admin';

  constructor(private http: HttpClient) { }

  // User management methods
  getUsers(options: { page?: number; limit?: number; search?: string } = {}): Observable<any> {
    let params = new HttpParams();

    // Set defaults if not provided
    const page = options.page || 1;
    const limit = options.limit || 10;

    params = params.set('page', page.toString());
    params = params.set('limit', limit.toString());

    if (options.search) {
      params = params.set('search', options.search);
    }

    return this.http.get(`${this.apiUrl}/users`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return of({ users: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } });
      })
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting user ${id}:`, error);
        return of({ error: true, message: error.error?.message || 'Failed to delete user' });
      })
    );
  }

  // Book management methods
  getBooks(options: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  } = {}): Observable<any> {
    let params = new HttpParams();

    if (options.page) params = params.set('page', options.page.toString());
    if (options.limit) params = params.set('limit', options.limit.toString());
    if (options.search) params = params.set('search', options.search);
    if (options.category) params = params.set('category', options.category);
    if (options.sort) params = params.set('sort', options.sort);
    if (options.order) params = params.set('order', options.order);

    return this.http.get(`${this.apiUrl}/books`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching books:', error);
        return of({ books: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } });
      })
    );
  }

  getBook(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/books/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching book ${id}:`, error);
        return of({ book: null });
      })
    );
  }

  addBook(bookData: any): Observable<any> {
    // Create FormData object to handle file uploads
    const formData = new FormData();

    // Add all text fields to FormData
    formData.append('title', bookData.title);
    formData.append('price', bookData.price.toString());

    // Handle authors array
    if (Array.isArray(bookData.authors)) {
      bookData.authors.forEach((author: string, index: number) => {
        formData.append(`authors[${index}]`, author);
      });
    } else if (typeof bookData.authors === 'string') {
      formData.append('authors', bookData.authors);
    }

    formData.append('description', bookData.description || '');
    formData.append('stock', bookData.stock.toString());
    formData.append('category', bookData.category || '');

    // If there's a file, add it with the correct field name 'image'
    if (bookData.image) {
      formData.append('image', bookData.image);
    }

    return this.http.post(`${this.apiUrl}/books`, formData).pipe(
      catchError(error => {
        console.error('Error adding book:', error);
        return of({ error: true, message: error.error?.message || 'Failed to add book' });
      })
    );
  }

  updateBook(id: string, bookData: any): Observable<any> {
    const formData = new FormData();

    formData.append('title', bookData.title);
    formData.append('price', bookData.price.toString());

    // Handle authors array
    if (Array.isArray(bookData.authors)) {
      bookData.authors.forEach((author: string, index: number) => {
        formData.append(`authors[${index}]`, author);
      });
    } else if (typeof bookData.authors === 'string') {
      formData.append('authors', bookData.authors);
    }

    formData.append('description', bookData.description || '');
    formData.append('stock', bookData.stock.toString());
    formData.append('category', bookData.category || '');

    // If there's a new image file, add it
    if (bookData.image) {
      formData.append('image', bookData.image);
    }

    return this.http.put(`${this.apiUrl}/books/${id}`, formData).pipe(
      catchError(error => {
        console.error(`Error updating book ${id}:`, error);
        return of({ error: true, message: error.error?.message || 'Failed to update book' });
      })
    );
  }

  deleteBook(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/books/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting book ${id}:`, error);
        return of({ error: true, message: error.error?.message || 'Failed to delete book' });
      })
    );
  }

  // User activity monitoring methods
  getOnlineUsers(options: {
    page?: number;
    limit?: number;
    detailed?: boolean;
  } = {}): Observable<any> {
    let params = new HttpParams();

    if (options.page) params = params.set('page', options.page.toString());
    if (options.limit) params = params.set('limit', options.limit.toString());
    if (options.detailed !== undefined) params = params.set('detailed', options.detailed.toString());

    return this.http.get(`${this.apiUrl}/users/online`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching online users:', error);
        return of({ users: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } });
      })
    );
  }


  // Order management methods
  getOrders(options: {
    page?: number;
    limit?: number;
    user?: string;
    status?: string;
    payment_method?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Observable<any> {
    let params = new HttpParams();

    if (options.page) params = params.set('page', options.page.toString());
    if (options.limit) params = params.set('limit', options.limit.toString());
    if (options.user) params = params.set('user', options.user);
    if (options.status) params = params.set('status', options.status);
    if (options.payment_method) params = params.set('payment_method', options.payment_method);
    if (options.startDate) params = params.set('startDate', options.startDate);
    if (options.endDate) params = params.set('endDate', options.endDate);

    return this.http.get(`http://localhost:5000/order`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching orders:', error);
        return of({ orders: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } });
      })
    );
  }

  getOrder(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching order ${id}:`, error);
        return of(null);
      })
    );
  }

  updateOrder(id: string, orderData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${id}`, orderData).pipe(
      catchError(error => {
        console.error(`Error updating order ${id}:`, error);
        return of({ error: true, message: error.error?.message || 'Failed to update order' });
      })
    );
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orders/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting order ${id}:`, error);
        return of({ error: true, message: error.error?.message || 'Failed to delete order' });
      })
    );
  }

  // Dashboard statistics
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/stats`).pipe(
      catchError(error => {
        console.error('Error fetching dashboard stats:', error);
        return of({
          totalUsers: 0,
          totalBooks: 0,
          totalOrders: 0,
          totalRevenue: 0
        });
      })
    );
  }

  // Notification methods
  sendAdminNotification(data: {
    userId: string;
    message: string;
    type: string;
    metadata?: any;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/send`, data).pipe(
      catchError(error => {
        console.error('Error sending notification:', error);
        return of({ error: true, message: error.error?.message || 'Failed to send notification' });
      })
    );
  }

  broadcastSystemMessage(data: {
    message: string;
    type: 'maintenance' | 'alert' | 'info';
    duration: number;
    targetRoles?: string[];
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/system/broadcast`, data).pipe(
      catchError(error => {
        console.error('Error broadcasting system message:', error);
        return of({ error: true, message: error.error?.message || 'Failed to broadcast system message' });
      })
    );
  }

  // System health
  getSystemHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/system/health`, {}).pipe(
      catchError(error => {
        console.error('Error fetching system health:', error);
        return of({
          uptime: 0,
          memory: { used: 0, total: 0 },
          process: { memory: { rss: 0, heapTotal: 0, heapUsed: 0, external: 0 }, uptime: 0, pid: 0 },
          cpu: { usage: 0, cores: 0 },
          versions: { node: '' },
          env: 'development',
          activeConnections: 0,
          activeUsers: 0
        });
      })
    );
  }

  getUserConnections(userId: string, detailed: boolean = true): Observable<any> {
    let params = new HttpParams();
    if (detailed) {
      params = params.set('detailed', 'true');
    }

    return this.http.get(`${this.apiUrl}/users/${userId}/connections`, { params }).pipe(
      catchError(error => {
        console.error(`Error fetching user connections for ${userId}:`, error);
        return of([]);
      })
    );
  }

  getUserActivityHistory(userId: string, limit: number = 20): Observable<any> {
    let params = new HttpParams().set('limit', limit.toString());

    return this.http.get(`${this.apiUrl}/users/${userId}/history`, { params }).pipe(
      catchError(error => {
        console.error(`Error fetching user activity history for ${userId}:`, error);
        return of({ activities: [] });
      })
    );
  }

  disconnectUser(userId: string, socketId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/disconnect`, { userId, socketId }).pipe(
      catchError(error => {
        console.error('Error disconnecting user:', error);
        return of({ error: true, message: error.error?.message || 'Failed to disconnect user' });
      })
    );
  }

  disconnectAllUserInstances(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/disconnect-all`, {}).pipe(
      catchError(error => {
        console.error(`Error disconnecting all sessions for user ${userId}:`, error);
        return of({ error: true, message: error.error?.message || 'Failed to disconnect all user sessions' });
      })
    );
  }
}