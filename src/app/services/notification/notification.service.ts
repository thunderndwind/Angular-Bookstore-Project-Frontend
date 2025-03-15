import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket, io } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CloseScrollStrategy } from '@angular/cdk/overlay';



@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'https://celeste-fbd25ae57588.herokuapp.com';
  private socket: Socket;
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  public updateNotifications(notifications: any[]): void {
    this.notificationsSubject.next(notifications);
  }
  
  
  constructor(private http: HttpClient, private authService: AuthService) { 
    this.socket = io(this.apiUrl, { transports: ['websocket'] });
    this.setupSocketListeners();

  }

  private setupSocketListeners() {
    this.socket.on('notification', (notification: any) => {
      const currentNotifications = this.notificationsSubject.value;
      this.notificationsSubject.next([notification, ...currentNotifications]);
    });
  }

  getNotifications(page: number, limit: number): Observable<any> {
    const userId = this.authService.getCurrentUserId(); 
    return this.http.get(`${this.apiUrl}/notifications/user/${userId}`, {
      params: { page, limit },
    });CloseScrollStrategy
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/notifications/${notificationId}/read`,
      {}
    );
  }

  markAllAsRead(): Observable<any> {
    const userId = this.authService.getCurrentUserId(); 

    return this.http.put(`${this.apiUrl}/notifications/user/${userId}/read-all`, {});
  }

  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notifications/${notificationId}`);
  }

  deleteAllNotifications(): Observable<any> {
    const userId = this.authService.getCurrentUserId(); 
    return this.http.delete(`${this.apiUrl}/notifications/user/${userId}`);
  }

  getUnreadCount(): Observable<any> {
    const userId = this.authService.getCurrentUserId(); 
    return this.http.get(`${this.apiUrl}/notifications/user/${userId}/unread-count`);
  }

}

