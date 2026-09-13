import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Competition {
  id: number;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  location: string;
  verein_id: number;
  verein: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CompetitionData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  location: string;
  vereinId: number;
}

@Injectable({
  providedIn: 'root',
})
export class CompetitionService {
  private readonly apiUrl = 'http://localhost:3000/competitions';

  constructor(private readonly http: HttpClient) { }

  getAll(): Observable<Competition[]> {
    return this.http.get<Competition[]>(this.apiUrl, {
      withCredentials: true,
    });
  }

  getUpcoming(): Observable<Competition[]> {
    return this.http.get<Competition[]>(
      `${this.apiUrl}/upcoming`,
      {
        withCredentials: true,
      },
    );
  }

  getOne(id: number): Observable<Competition> {
    return this.http.get<Competition>(
      `${this.apiUrl}/${id}`,
      {
        withCredentials: true,
      },
    );
  }

  create(data: CompetitionData): Observable<Competition> {
    return this.http.post<Competition>(
      this.apiUrl,
      data,
      {
        withCredentials: true,
      },
    );
  }

  update(
    id: number,
    data: CompetitionData,
  ): Observable<Competition> {
    return this.http.put<Competition>(
      `${this.apiUrl}/${id}`,
      data,
      {
        withCredentials: true,
      },
    );
  }
}
