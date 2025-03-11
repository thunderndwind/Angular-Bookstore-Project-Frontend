import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5000/admin';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/books`);
  }

  getBook(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/books/${id}`);
  }

  addBook(bookData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/books`, bookData);
  }

  updateBook(id: string, bookData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/books/${id}`, bookData);
  }

  deleteBook(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/books/${id}`);
  }

  // User management methods
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }
}
