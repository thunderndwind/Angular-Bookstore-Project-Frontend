import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5000/admin';

  constructor(private http: HttpClient) {}

  getBooks(page: number = 1, limit: number = 3): Observable<any> {
    return this.http.get(`${this.apiUrl}/books?page=${page}&limit=${limit}`);
  }

  getBook(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/books/${id}`);
  }

  addBook(bookData: any): Observable<any> {
    // Create FormData object to handle file uploads
    const formData = new FormData();
    
    // Add all text fields to FormData
    formData.append('title', bookData.title);
    formData.append('price', bookData.price.toString());
    formData.append('authors', bookData.authors);
    formData.append('description', bookData.description || '');
    formData.append('stock', bookData.stock.toString());
    
    // If there's an existing image URL, add it
    if (bookData.img) {
      formData.append('img', bookData.img);
    }
    
    // If there's a file, add it with the correct field name 'image'
    if (bookData.bookCover) {
      formData.append('image', bookData.bookCover);
    }
    
    return this.http.post(`${this.apiUrl}/books`, formData);
  }

  updateBook(id: string, bookData: any): Observable<any> {
    const formData = new FormData();
    
    formData.append('title', bookData.title);
    formData.append('price', bookData.price.toString());
    formData.append('authors', bookData.authors);
    formData.append('description', bookData.description || '');
    formData.append('stock', bookData.stock.toString());
    
    if (bookData.img) {
      formData.append('img', bookData.img);
    }
    
    if (bookData.bookCover) {
      formData.append('image', bookData.bookCover);
    }
    
    return this.http.put(`${this.apiUrl}/books/${id}`, formData);
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