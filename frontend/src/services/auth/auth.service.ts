// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface User {
  id ?: number;
  email: string;
  accessToken ?: string;
  // Add other user properties as needed
}

interface loginResponse {
  message: string;
  accessToken: string;
  user: {
    id: number;
    email: string;
  };
}



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<loginResponse> {
    return this.http.post<loginResponse>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((response: loginResponse) => {
        const userData = {
          ...response.user,
          accessToken: response.accessToken
        };
        this.userSubject.next(userData);
      })
    );
  }

  signUp(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { email, password }).pipe(
      tap(() => {
        // Auto-login after signup
        this.login(email, password).subscribe();
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => {
        this.userSubject.next(null);
        this.router.navigate(['/login']);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  refreshToken(): Observable<loginResponse> {
    return this.http.get<loginResponse>(`${this.baseUrl}/refresh`).pipe(
      tap((response) => {
        console.log('Refreshing token:', response);
        const userData = {
          ...response.user,
          accessToken: response.accessToken
        };
        this.userSubject.next(userData);

      })
    );
  }

}