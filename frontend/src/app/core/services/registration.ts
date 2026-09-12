import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegistrationMember {
  id: number;
  firstName: string;
  lastName: string;
}

export interface RegistrationFahrer {
  id: number;
  firstName: string;
  lastName: string;
}

export interface RegistrationCompetition {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  verein_id: number;
  verein: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Einzelkuer {
  id: number;
  titel: string;
  platzierung: number | null;
  fahrer: {
    user: RegistrationFahrer;
  }[];
}

export interface Paarkuer {
  id: number;
  titel: string;
  platzierung: number | null;
  fahrer: {
    user: RegistrationFahrer;
  }[];
}

export interface Gruppenkuer {
  id: number;
  titel: string;
  fahrer_anzahl: number;
  ersatzfahrer_anzahl: number;
  platzierung: number | null;
  fahrer: {
    user: RegistrationFahrer;
  }[];
  ersatzfahrer: {
    user: RegistrationFahrer;
  }[];
}

export interface Registrations {
  einzel: Einzelkuer[];
  paar: Paarkuer[];
  kleingruppe: Gruppenkuer[];
  grossgruppe: Gruppenkuer[];
}

export interface EinzelkuerData {
  competitionId: number;
  vereinId: number;
  titel: string;
  fahrerId: number;
}

export interface PaarkuerData {
  competitionId: number;
  vereinId: number;
  titel: string;
  fahrerIds: number[];
}

export interface GruppenkuerData {
  competitionId: number;
  vereinId: number;
  titel: string;
  fahrerIds: number[];
  ersatzfahrerIds: number[];
}

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private readonly apiUrl =
    'http://localhost:3000/registrations';

  constructor(private readonly http: HttpClient) { }

  getCompetitions(): Observable<RegistrationCompetition[]> {
    return this.http.get<RegistrationCompetition[]>(
      `${this.apiUrl}/competitions`,
      {
        withCredentials: true,
      },
    );
  }

  getMembers(
    vereinId: number,
  ): Observable<RegistrationMember[]> {
    return this.http.get<RegistrationMember[]>(
      `${this.apiUrl}/members/${vereinId}`,
      {
        withCredentials: true,
      },
    );
  }

  getRegistrations(
    competitionId: number,
    vereinId: number,
  ): Observable<Registrations> {
    return this.http.get<Registrations>(
      `${this.apiUrl}/list/${competitionId}/${vereinId}`,
      {
        withCredentials: true,
      },
    );
  }

  createEinzel(
    data: EinzelkuerData,
  ): Observable<unknown> {
    return this.http.post(
      `${this.apiUrl}/einzel`,
      data,
      {
        withCredentials: true,
      },
    );
  }

  createPaar(
    data: PaarkuerData,
  ): Observable<unknown> {
    return this.http.post(
      `${this.apiUrl}/paar`,
      data,
      {
        withCredentials: true,
      },
    );
  }

  createKleingruppe(
    data: GruppenkuerData,
  ): Observable<unknown> {
    return this.http.post(
      `${this.apiUrl}/kleingruppe`,
      data,
      {
        withCredentials: true,
      },
    );
  }

  createGrossgruppe(
    data: GruppenkuerData,
  ): Observable<unknown> {
    return this.http.post(
      `${this.apiUrl}/grossgruppe`,
      data,
      {
        withCredentials: true,
      },
    );
  }
}

