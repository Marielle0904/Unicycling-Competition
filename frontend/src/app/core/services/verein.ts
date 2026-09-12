import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VereinData {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class VereinService {
  private readonly apiUrl = 'http://localhost:3000/vereine';

  constructor(private readonly http: HttpClient) { }

  getAll(): Observable<VereinData[]> {
    return this.http.get<VereinData[]>(this.apiUrl, {
      withCredentials: true,
    });
  }

  getMyVereine(): Observable<VereinData[]> {
    return this.http.get<VereinData[]>(`${this.apiUrl}/meine`, {
      withCredentials: true,
    });
  }

  create(name: string, email: string): Observable<VereinData> {
    return this.http.post<VereinData>(
      this.apiUrl,
      {
        name,
        email,
      },
      {
        withCredentials: true,
      },
    );
  }

  join(vereinId: number): Observable<VereinData> {
    return this.http.post<VereinData>(
      `${this.apiUrl}/${vereinId}/join`,
      {},
      {
        withCredentials: true,
      },
    );
  }
}
