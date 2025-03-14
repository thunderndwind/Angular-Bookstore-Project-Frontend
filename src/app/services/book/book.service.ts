import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:5000'; // Updated base URL

  constructor(private http: HttpClient) { }

  // Fetch books with pagination
  getBooks(page: number = 0, limit: number = 10): Observable<any> {
    const url = `${this.apiUrl}/?page=${page}&limit=${limit}`; // Updated URL to match router
    console.log('Fetching books from:', url);
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError('getBooks', { books: [], total: 0 }))
      );
  }

  // Fetch a single book by ID
  getBookById(id: string): Observable<any> {
    const url = `${this.apiUrl}/book/${id}`; // Updated URL to match router
    console.log('Fetching book by ID:', url);
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError(`getBook id=${id}`))
      );
  }

  // Handle errors gracefully
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}