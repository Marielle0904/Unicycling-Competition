import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000';

  currentUser = signal<User | null>(null);

  constructor(private readonly http: HttpClient) { }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/auth/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/auth/me`,
      {
        withCredentials: true,
      },
    );
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/auth/logout`,
      {},
      {
        withCredentials: true,
      },
    );
  }
}
