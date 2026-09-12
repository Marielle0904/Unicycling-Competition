import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  Competition,
  CompetitionService,
} from '../../core/services/competition';

@Component({
  selector: 'app-competitions',
  imports: [DatePipe],
  templateUrl: './competitions.html',
  styleUrl: './competitions.css',
})
export class Competitions implements OnInit {
  competitions = signal<Competition[]>([]);
  errorMessage = signal('');

  constructor(
    private readonly competitionService: CompetitionService,
  ) { }

  ngOnInit(): void {
    this.loadCompetitions();
  }

  loadCompetitions(): void {
    this.competitionService.getAll().subscribe({
      next: (competitions) => {
        this.competitions.set(competitions);
      },
      error: () => {
        this.errorMessage.set(
          'Wettkämpfe konnten nicht geladen werden.',
        );
      },
    });
  }
}
