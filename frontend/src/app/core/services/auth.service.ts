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

  roles: {
    trainer: boolean;
    juror: boolean;
    juryleitung: boolean;
    admin: boolean;
  };
}export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;

  roles: {
    trainer: boolean;
    juror: boolean;
    juryleitung: boolean;
    admin: boolean;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
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

  register(data: RegisterData): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/users/register`,
      data,
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

  getMyRoleApplications(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/role-applications/me`,
      { withCredentials: true }
    );
  }

  createRoleApplication(data: {
    role: 'TRAINER' | 'JUROR' | 'JURYLEITUNG';
    vereinId?: number;
    reason?: string;
  }) {
    return this.http.post(
      `${this.apiUrl}/role-applications`,
      data,
      { withCredentials: true }
    );
  }
}
