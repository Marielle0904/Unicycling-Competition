import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  Competition,
  CompetitionData,
  CompetitionService,
} from '../../core/services/competition';
import {
  VereinData,
  VereinService,
} from '../../core/services/verein';

@Component({
  selector: 'app-management',
  imports: [FormsModule, DatePipe],
  templateUrl: './management.html',
  styleUrl: './management.css',
})
export class Management implements OnInit {
  competitions = signal<Competition[]>([]);
  vereine = signal<VereinData[]>([]);

  showForm = signal(false);
  editingCompetition = signal<Competition | null>(null);

  name = '';
  description = '';
  startDate = '';
  endDate = '';
  location = '';
  vereinId: number | null = null;

  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private readonly competitionService: CompetitionService,
    private readonly vereinService: VereinService,
  ) { }

  ngOnInit(): void {
    this.loadCompetitions();
    this.loadVereine();
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

  loadVereine(): void {
    this.vereinService.getAll().subscribe({
      next: (vereine) => {
        this.vereine.set(vereine);
      },
      error: () => {
        this.errorMessage.set(
          'Vereine konnten nicht geladen werden.',
        );
      },
    });
  }

  openCreate(): void {
    this.resetForm();

    this.editingCompetition.set(null);
    this.showForm.set(true);
  }

  openEdit(competition: Competition): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    this.editingCompetition.set(competition);

    this.name = competition.name;
    this.description = competition.description ?? '';
    this.startDate = this.toDateTimeLocal(
      competition.startDate,
    );
    this.endDate = this.toDateTimeLocal(
      competition.endDate,
    );
    this.location = competition.location;
    this.vereinId = competition.verein_id;

    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingCompetition.set(null);
  }

  saveCompetition(): void {
    if (
      !this.name.trim() ||
      !this.startDate ||
      !this.endDate ||
      !this.location.trim() ||
      this.vereinId === null
    ) {
      this.errorMessage.set(
        'Bitte fülle alle Pflichtfelder aus.',
      );
      return;
    }

    const data: CompetitionData = {
      name: this.name.trim(),
      description: this.description.trim() || undefined,
      startDate: this.startDate,
      endDate: this.endDate,
      location: this.location.trim(),
      vereinId: this.vereinId,
    };

    this.errorMessage.set('');
    this.successMessage.set('');

    const editing = this.editingCompetition();

    if (editing) {
      this.competitionService
        .update(editing.id, data)
        .subscribe({
          next: () => {
            this.successMessage.set(
              'Wettkampf erfolgreich geändert.',
            );

            this.closeForm();
            this.loadCompetitions();
          },
          error: (error) => {
            this.errorMessage.set(
              error.error?.message ??
              'Wettkampf konnte nicht geändert werden.',
            );
          },
        });

      return;
    }

    this.competitionService.create(data).subscribe({
      next: () => {
        this.successMessage.set(
          'Wettkampf erfolgreich erstellt.',
        );

        this.closeForm();
        this.loadCompetitions();
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message ??
          'Wettkampf konnte nicht erstellt werden.',
        );
      },
    });
  }

  private resetForm(): void {
    this.name = '';
    this.description = '';
    this.startDate = '';
    this.endDate = '';
    this.location = '';
    this.vereinId = null;

    this.errorMessage.set('');
    this.successMessage.set('');
  }

  private toDateTimeLocal(date: string): string {
    const value = new Date(date);

    const year = value.getFullYear();
    const month = String(
      value.getMonth() + 1,
    ).padStart(2, '0');
    const day = String(
      value.getDate(),
    ).padStart(2, '0');
    const hours = String(
      value.getHours(),
    ).padStart(2, '0');
    const minutes = String(
      value.getMinutes(),
    ).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
