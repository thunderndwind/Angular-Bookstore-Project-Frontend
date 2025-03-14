import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  getBooks(page: number = 0, limit: number = 10): Observable<any> {
    const url = `${this.apiUrl}/?page=${page}&limit=${limit}`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError('getBooks', { books: [], total: 0 }))
      );
  }

  getBookById(id: string): Observable<any> {
    const url = `${this.apiUrl}/book/${id}`;
    console.log('Fetching book by ID:', url);
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError(`getBook id=${id}`))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}