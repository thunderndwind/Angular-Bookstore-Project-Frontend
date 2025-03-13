// auth.interceptor.ts
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, filter, switchMap, take, throwError } from 'rxjs';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

// Use a closure to manage the refreshing state
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  
  // Make sure we're accessing the methods correctly
  const token = authService.getAccessToken();
  
  if (token) {
    req = addTokenToRequest(req, token);
  }

  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handleUnauthorized(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function addTokenToRequest(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handleUnauthorized(
  request: HttpRequest<unknown>, 
  next: HttpHandlerFn, 
  authService: AuthService
): Observable<any> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return from(authService.refreshAccessToken()).pipe(
      switchMap(token => {
        isRefreshing = false;
        
        if (token) {
          refreshTokenSubject.next(token);
          return next(addTokenToRequest(request, token));
        }
        
        // If token refresh fails, logout and redirect to login
        authService.logout();
        return throwError(() => 'Session expired. Please login again.');
      }),
      catchError(err => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        return next(addTokenToRequest(request, token as string));
      })
    );
  }
}