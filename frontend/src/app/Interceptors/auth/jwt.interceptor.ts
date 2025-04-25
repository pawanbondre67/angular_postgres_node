// jwt.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let isRefreshing = false;

  const user = authService.getCurrentUser();
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJwYXdhbmJvbmRyZTE5QGdtYWlsLmNvbSIsImlhdCI6MTc0NTQ5NjQ0Nn0.W9Bhk1Y_9sSNKheQyjckKEUOqTY8kLx-Y7mxwV-TYwI";

  console.log('Access Token:', accessToken); // Debugging line
  console.log('User:', user); // Debugging line

  // Clone the request and add the authorization header
  const authReq = accessToken 
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.error.message === 'Access token expired' || error.status === 403) {
        if (!isRefreshing) {
          isRefreshing = true;
          return authService.refreshToken().pipe(
            switchMap((token: any) => {
              isRefreshing = false;
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token.accessToken}`
                }
              });
              return next(newReq);
            }),
            catchError((err) => {
              isRefreshing = false;
              authService.logout().subscribe();
              return throwError(() => err);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};