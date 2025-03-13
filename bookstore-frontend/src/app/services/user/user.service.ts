import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000'; //nodejs server - checkkk

  constructor(private http: HttpClient) {}

  getUser(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${id}`);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${id}`, userData);
  }
}