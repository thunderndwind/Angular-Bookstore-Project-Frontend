import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
  newArrival?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'api/books'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> {
    // Return mock data for now
    return of(this.getMockBooks())
      .pipe(
        catchError(this.handleError<Book[]>('getBooks', []))
      );
    
    // Uncomment when you have a real API
    // return this.http.get<Book[]>(this.apiUrl)
    //   .pipe(
    //     catchError(this.handleError<Book[]>('getBooks', []))
    //   );
  }

  getFeaturedBooks(): Observable<Book[]> {
    return of(this.getMockBooks().filter(book => book.featured))
      .pipe(
        catchError(this.handleError<Book[]>('getFeaturedBooks', []))
      );
  }

  getNewArrivals(): Observable<Book[]> {
    return of(this.getMockBooks().filter(book => book.newArrival))
      .pipe(
        catchError(this.handleError<Book[]>('getNewArrivals', []))
      );
  }

  getBookById(id: number): Observable<Book> {
    const url = `${this.apiUrl}/${id}`;
    return of(this.getMockBooks().find(book => book.id === id) as Book)
      .pipe(
        catchError(this.handleError<Book>(`getBook id=${id}`))
      );
    
    // Uncomment when you have a real API
    // return this.http.get<Book>(url)
    //   .pipe(
    //     catchError(this.handleError<Book>(`getBook id=${id}`))
    //   );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private getMockBooks(): Book[] {
    return [
      {
        id: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'A story of wealth, love, and tragedy in the Jazz Age.',
        price: 12.99,
        image: 'assets/images/books/great-gatsby.jpg',
        category: 'Fiction',
        featured: true
      },
      {
        id: 2,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        description: 'A classic tale of racial injustice and moral growth in the American South.',
        price: 14.99,
        image: 'assets/images/books/mockingbird.jpg',
        category: 'Fiction',
        featured: true
      },
      {
        id: 3,
        title: '1984',
        author: 'George Orwell',
        description: 'A dystopian novel about totalitarianism and surveillance.',
        price: 11.99,
        image: 'assets/images/books/1984.jpg',
        category: 'Science Fiction',
        featured: true
      },
      {
        id: 4,
        title: 'The Midnight Library',
        author: 'Matt Haig',
        description: 'A novel about the infinite possibilities of life and the choices we make.',
        price: 16.99,
        image: 'assets/images/books/midnight-library.jpg',
        category: 'Fiction',
        newArrival: true
      },
      {
        id: 5,
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        description: 'A lone astronaut must save humanity from extinction.',
        price: 15.99,
        image: 'assets/images/books/hail-mary.jpg',
        category: 'Science Fiction',
        newArrival: true
      },
      {
        id: 6,
        title: 'The Four Winds',
        author: 'Kristin Hannah',
        description: 'A story of hope, courage, and sacrifice during the Great Depression.',
        price: 13.99,
        image: 'assets/images/books/four-winds.jpg',
        category: 'Historical Fiction',
        newArrival: true
      }
    ];
  }
}