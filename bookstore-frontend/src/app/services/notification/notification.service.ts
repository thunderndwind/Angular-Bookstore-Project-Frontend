import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket, io } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:5000'; //nodejs server
  private socket: Socket;
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  public updateNotifications(notifications: any[]): void {
    this.notificationsSubject.next(notifications);
  }
  
  
  constructor(private http: HttpClient) { 
    this.socket = io(this.apiUrl, { transports: ['websocket'] });
    this.setupSocketListeners();

  }

  private setupSocketListeners() {
    this.socket.on('notification', (notification: any) => {
      const currentNotifications = this.notificationsSubject.value;
      this.notificationsSubject.next([notification, ...currentNotifications]);
    });
  }

  getNotifications(page: number, limit: number, userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications/user/${userId}`, {
      params: { page, limit },
    });
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/notifications/${notificationId}/read`,
      {}
    );
  }

  markAllAsRead(userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/user/${userId}/read-all`, {});
  }

  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notifications/${notificationId}`);
  }

  deleteAllNotifications(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notifications/user/${userId}`);
  }

  getUnreadCount(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications/user/${userId}/unread-count`);
  }

}

