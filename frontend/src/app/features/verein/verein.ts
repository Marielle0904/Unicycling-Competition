import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VereinData, VereinService } from '../../core/services/verein';

@Component({
  selector: 'app-verein',
  imports: [FormsModule],
  templateUrl: './verein.html',
  styleUrl: './verein.css',
})
export class Verein implements OnInit {
  meineVereine = signal<VereinData[]>([]);
  alleVereine = signal<VereinData[]>([]);

  showJoin = signal(false);
  showCreate = signal(false);

  selectedVereinId: number | null = null;

  neuerVereinName = '';
  neuerVereinEmail = '';

  errorMessage = signal('');
  successMessage = signal('');

  constructor(private readonly vereinService: VereinService) { }

  ngOnInit(): void {
    this.loadMyVereine();
  }

  loadMyVereine(): void {
    this.vereinService.getMyVereine().subscribe({
      next: (vereine) => {
        this.meineVereine.set(vereine);
      },
      error: () => {
        this.errorMessage.set(
          'Vereine konnten nicht geladen werden.',
        );
      },
    });
  }

  openJoin(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.selectedVereinId = null;

    this.vereinService.getAll().subscribe({
      next: (vereine) => {
        this.alleVereine.set(vereine);
        this.showJoin.set(true);
      },
      error: () => {
        this.errorMessage.set(
          'Vereine konnten nicht geladen werden.',
        );
      },
    });
  }

  closeJoin(): void {
    this.showJoin.set(false);
    this.selectedVereinId = null;
  }

  joinVerein(): void {
    if (this.selectedVereinId === null) {
      this.errorMessage.set(
        'Bitte wähle einen Verein aus.',
      );
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    this.vereinService.join(this.selectedVereinId).subscribe({
      next: (verein) => {
        this.successMessage.set(
          `Du bist dem Verein "${verein.name}" beigetreten.`,
        );

        this.showJoin.set(false);
        this.loadMyVereine();
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message ??
          'Beitritt zum Verein fehlgeschlagen.',
        );
      },
    });
  }

  openCreate(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    this.neuerVereinName = '';
    this.neuerVereinEmail = '';

    this.showCreate.set(true);
  }

  closeCreate(): void {
    this.showCreate.set(false);
  }

  createVerein(): void {
    if (
      !this.neuerVereinName.trim() ||
      !this.neuerVereinEmail.trim()
    ) {
      this.errorMessage.set(
        'Bitte gib Vereinsname und E-Mail-Adresse an.',
      );
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    this.vereinService
      .create(
        this.neuerVereinName.trim(),
        this.neuerVereinEmail.trim(),
      )
      .subscribe({
        next: (verein) => {
          this.successMessage.set(
            `Der Verein "${verein.name}" wurde erfolgreich erstellt.`,
          );

          this.showCreate.set(false);
          this.loadMyVereine();
        },
        error: (error) => {
          this.errorMessage.set(
            error.error?.message ??
            'Verein konnte nicht erstellt werden.',
          );
        },
      });
  }
}
