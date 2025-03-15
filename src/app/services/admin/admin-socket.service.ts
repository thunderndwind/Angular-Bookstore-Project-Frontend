import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from '../auth/auth.service';
//import { environment } from '../../../environments/environment';

interface SocketConfig {
  reconnection: boolean;
  reconnectionAttempts: number;
  reconnectionDelay: number;
  auth: {
    token: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AdminSocketService {
  private socket: Socket | null = null;

  private apiUrl = 'https://celeste-fbd25ae57588.herokuapp.com'; // Use environment variable with fallback

  // Subjects for different event types
  private newOrderSubject = new Subject<any>();
  private userConnectionSubject = new Subject<any>();
  private systemAlertSubject = new Subject<any>();
  private errorSubject = new Subject<Error>();
  onError(): Observable<Error> { return this.errorSubject.asObservable(); }

  constructor(private authService: AuthService) { }

  // Connect to WebSocket server with authentication
  // Missing error subject declaration

  // Fix token refresh flow in connect()
  async connect(): Promise<void> {
    if (this.socket?.connected) return;

    try {
      let token = this.authService.getAccessToken();
      console.log(token);

      if (!token) {
        token = await this.authService.refreshAccessToken();
      }

      if (token) {
        this.initializeSocket(token);
      } else {
        this.errorSubject.next(new Error('Authentication failed'));
        this.authService.logout();
      }
    } catch (error) {
      this.errorSubject.next(error as Error);
      this.authService.logout();
    }
  }

  private initializeSocket(token: string): void {
    this.socket = io(this.apiUrl, { auth: { token } });
    this.setupEventListeners();
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners(); // Cleanup listeners
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Set up listeners for various admin events
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Listen for new orders
    this.socket.on('new-order', (data: any) => {
      this.newOrderSubject.next(data);
    });

    // Listen for user connection/disconnection events
    this.socket.on('user-connected', (data: any) => {
      this.userConnectionSubject.next({ ...data, event: 'connected' });
    });

    this.socket.on('user-disconnected', (data: any) => {
      this.userConnectionSubject.next({ ...data, event: 'disconnected' });
    });

    // Listen for system alerts
    this.socket.on('system-alert', (data: any) => {
      this.systemAlertSubject.next(data);
    });

    // Handle connection errors
    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  // Observable for new orders
  onNewOrder(): Observable<any> {
    return this.newOrderSubject.asObservable();
  }

  // Observable for user connection events
  onUserConnection(): Observable<any> {
    return this.userConnectionSubject.asObservable();
  }

  // Observable for system alerts
  onSystemAlert(): Observable<any> {
    return this.systemAlertSubject.asObservable();
  }
}