import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { signal } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';
import {
  Competition,
  CompetitionService,
} from '../../core/services/competition';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  competitions = signal<Competition[]>([]);
  competitionsLoading = signal(true);
  competitionsError = signal(false);

  constructor(
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly competitionService: CompetitionService,
  ) { }

  ngOnInit(): void {
    this.loadUpcomingCompetitions();
  }

  loadUpcomingCompetitions(): void {
    this.competitionsLoading.set(true);
    this.competitionsError.set(false);

    this.competitionService.getUpcoming().subscribe({
      next: (competitions) => {
        this.competitions.set(competitions);
        this.competitionsLoading.set(false);
      },

      error: (error) => {
        console.error(
          'Fehler beim Laden der kommenden Wettkämpfe:',
          error,
        );

        this.competitionsLoading.set(false);
        this.competitionsError.set(true);
      },
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.currentUser.set(null);
        this.router.navigate(['/login']);
      },

      error: (error) => {
        console.error('Logout fehlgeschlagen:', error);
      },
    });
  }
}
