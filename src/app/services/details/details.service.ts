
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookResponse, Book } from './books';
import { Review } from './review';
import { jwtDecode } from 'jwt-decode'; 
import { firstValueFrom } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DetailsServices {
  private apiUrl = 'http://localhost:5000/book';

  constructor(private http: HttpClient) { }

  getDetails(bookID: string): Observable<BookResponse> {
    return this.http.get<BookResponse>(`${this.apiUrl}/${bookID}`);
  }

  createReview(bookID: string, review: Partial<Review>) {
    return this.http.post<Review>(`${this.apiUrl}/${bookID}`, review);
  }

  deleteReview(bookID: string, reviewID: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${bookID}/${reviewID}`);
  }

  updateReview(bookID: string, reviewID: string, revBody: Partial<Review>): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${bookID}/${reviewID}`, revBody);
  }
  addToCart(cartBody: any){
    return this.http.patch<any>(`http://localhost:5000/cart/add`, cartBody); 
  }

async getUser(): Promise<{ name: string; _id: string } | undefined> {
  const token = localStorage.getItem('access_token'); 
  if (!token) return undefined;

  try {
    const decoded: any = jwtDecode(token);
    
    const user = await firstValueFrom(
      this.http.get<any>(`http://localhost:5000/user/${decoded.userId}`)
    );

    return { name: `${user.firstName} ${user.lastName}`, _id: user._id };

  } catch (error) {
    console.error('Error getting user:', error);
    return undefined;
  }
}
}

