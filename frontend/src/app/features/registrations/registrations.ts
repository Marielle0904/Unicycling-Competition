import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  RegistrationCompetition,
  RegistrationMember,
  RegistrationService,
  Registrations as RegistrationList,
} from '../../core/services/registration';
import {
  VereinData,
  VereinService,
} from '../../core/services/verein';

type Discipline =
  | 'einzel'
  | 'paar'
  | 'kleingruppe'
  | 'grossgruppe';

@Component({
  selector: 'app-registrations',
  imports: [FormsModule],
  templateUrl: './registrations.html',
  styleUrl: './registrations.css',
})
export class Registrations implements OnInit {
  competitions = signal<RegistrationCompetition[]>([]);
  vereine = signal<VereinData[]>([]);
  members = signal<RegistrationMember[]>([]);

  registrations = signal<RegistrationList>({
    einzel: [],
    paar: [],
    kleingruppe: [],
    grossgruppe: [],
  });

  selectedCompetitionId: number | null = null;
  selectedVereinId: number | null = null;

  activeDiscipline = signal<Discipline>('einzel');

  showForm = signal(false);

  titel = '';

  selectedFahrerIds: number[] = [];
  selectedErsatzfahrerIds: number[] = [];

  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private readonly registrationService: RegistrationService,
    private readonly vereinService: VereinService,
  ) { }

  ngOnInit(): void {
    this.loadCompetitions();
    this.loadVereine();
  }

  loadCompetitions(): void {
    this.registrationService.getCompetitions().subscribe({
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

  selectVerein(): void {
    this.members.set([]);

    this.registrations.set({
      einzel: [],
      paar: [],
      kleingruppe: [],
      grossgruppe: [],
    });

    if (this.selectedVereinId === null) {
      return;
    }

    this.registrationService
      .getMembers(this.selectedVereinId)
      .subscribe({
        next: (members) => {
          this.members.set(members);
        },
        error: (error) => {
          this.errorMessage.set(
            error.error?.message ??
            'Mitglieder konnten nicht geladen werden.',
          );
        },
      });

    this.loadRegistrations();
  }

  loadRegistrations(): void {
    if (
      this.selectedCompetitionId === null ||
      this.selectedVereinId === null
    ) {
      return;
    }

    console.log(
      'Lade Anmeldungen:',
      this.selectedCompetitionId,
      this.selectedVereinId,
    );

    this.registrationService
      .getRegistrations(
        this.selectedCompetitionId,
        this.selectedVereinId,
      )
      .subscribe({
        next: (registrations) => {
          console.log(
            'Anmeldungen vom Backend:',
            registrations,
          );

          this.registrations.set(registrations);
        },
        error: (error) => {
          console.error(
            'Fehler beim Laden der Anmeldungen:',
            error,
          );

          this.errorMessage.set(
            error.error?.message ??
            'Anmeldungen konnten nicht geladen werden.',
          );
        },
      });
  }

  setDiscipline(
    discipline: Discipline,
  ): void {
    this.activeDiscipline.set(discipline);
  }

  openForm(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    this.titel = '';
    this.selectedFahrerIds = [];
    this.selectedErsatzfahrerIds = [];

    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  toggleFahrer(userId: number): void {
    if (this.selectedFahrerIds.includes(userId)) {
      this.selectedFahrerIds =
        this.selectedFahrerIds.filter(
          (id) => id !== userId,
        );
    } else {
      this.selectedFahrerIds = [
        ...this.selectedFahrerIds,
        userId,
      ];
    }
  }

  toggleErsatzfahrer(userId: number): void {
    if (
      this.selectedErsatzfahrerIds.includes(userId)
    ) {
      this.selectedErsatzfahrerIds =
        this.selectedErsatzfahrerIds.filter(
          (id) => id !== userId,
        );
    } else {
      this.selectedErsatzfahrerIds = [
        ...this.selectedErsatzfahrerIds,
        userId,
      ];
    }
  }

  isFahrerSelected(userId: number): boolean {
    return this.selectedFahrerIds.includes(userId);
  }

  isErsatzfahrerSelected(
    userId: number,
  ): boolean {
    return this.selectedErsatzfahrerIds.includes(
      userId,
    );
  }

  save(): void {
    if (
      this.selectedCompetitionId === null ||
      this.selectedVereinId === null
    ) {
      this.errorMessage.set(
        'Bitte wähle Wettkampf und Verein aus.',
      );
      return;
    }

    if (!this.titel.trim()) {
      this.errorMessage.set(
        'Bitte gib einen Kürtitel an.',
      );
      return;
    }

    const competitionId =
      this.selectedCompetitionId;

    const vereinId = this.selectedVereinId;

    const discipline =
      this.activeDiscipline();

    this.errorMessage.set('');
    this.successMessage.set('');

    if (discipline === 'einzel') {
      this.saveEinzel(
        competitionId,
        vereinId,
      );
    }

    if (discipline === 'paar') {
      this.savePaar(
        competitionId,
        vereinId,
      );
    }

    if (discipline === 'kleingruppe') {
      this.saveKleingruppe(
        competitionId,
        vereinId,
      );
    }

    if (discipline === 'grossgruppe') {
      this.saveGrossgruppe(
        competitionId,
        vereinId,
      );
    }
  }

  private saveEinzel(
    competitionId: number,
    vereinId: number,
  ): void {
    if (this.selectedFahrerIds.length !== 1) {
      this.errorMessage.set(
        'Eine Einzelkür benötigt genau einen Fahrer.',
      );
      return;
    }

    this.registrationService
      .createEinzel({
        competitionId,
        vereinId,
        titel: this.titel.trim(),
        fahrerId: this.selectedFahrerIds[0],
      })
      .subscribe({
        next: () => {
          this.registrationSaved();
        },
        error: (error) => {
          this.showBackendError(error);
        },
      });
  }

  private savePaar(
    competitionId: number,
    vereinId: number,
  ): void {
    if (this.selectedFahrerIds.length !== 2) {
      this.errorMessage.set(
        'Eine Paarkür benötigt genau zwei Fahrer.',
      );
      return;
    }

    this.registrationService
      .createPaar({
        competitionId,
        vereinId,
        titel: this.titel.trim(),
        fahrerIds: this.selectedFahrerIds,
      })
      .subscribe({
        next: () => {
          this.registrationSaved();
        },
        error: (error) => {
          this.showBackendError(error);
        },
      });
  }

  private saveKleingruppe(
    competitionId: number,
    vereinId: number,
  ): void {
    if (
      this.selectedFahrerIds.length < 3 ||
      this.selectedFahrerIds.length > 8
    ) {
      this.errorMessage.set(
        'Eine Kleingruppe benötigt 3 bis 8 Fahrer.',
      );
      return;
    }

    if (this.selectedErsatzfahrerIds.length > 2) {
      this.errorMessage.set(
        'Es sind maximal zwei Ersatzfahrer erlaubt.',
      );
      return;
    }

    this.registrationService
      .createKleingruppe({
        competitionId,
        vereinId,
        titel: this.titel.trim(),
        fahrerIds: this.selectedFahrerIds,
        ersatzfahrerIds:
          this.selectedErsatzfahrerIds,
      })
      .subscribe({
        next: () => {
          this.registrationSaved();
        },
        error: (error) => {
          this.showBackendError(error);
        },
      });
  }

  private saveGrossgruppe(
    competitionId: number,
    vereinId: number,
  ): void {
    if (this.selectedFahrerIds.length < 9) {
      this.errorMessage.set(
        'Eine Großgruppe benötigt mindestens neun Fahrer.',
      );
      return;
    }

    if (this.selectedErsatzfahrerIds.length > 2) {
      this.errorMessage.set(
        'Es sind maximal zwei Ersatzfahrer erlaubt.',
      );
      return;
    }

    this.registrationService
      .createGrossgruppe({
        competitionId,
        vereinId,
        titel: this.titel.trim(),
        fahrerIds: this.selectedFahrerIds,
        ersatzfahrerIds:
          this.selectedErsatzfahrerIds,
      })
      .subscribe({
        next: () => {
          this.registrationSaved();
        },
        error: (error) => {
          this.showBackendError(error);
        },
      });
  }

  private registrationSaved(): void {
    this.successMessage.set(
      'Kür erfolgreich hinzugefügt.',
    );

    this.closeForm();

    this.loadRegistrations();
  }

  private showBackendError(error: any): void {
    this.errorMessage.set(
      error.error?.message ??
      'Kür konnte nicht gespeichert werden.',
    );
  }
}

