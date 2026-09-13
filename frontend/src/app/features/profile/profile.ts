import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  roleApplications: any[] = [];
  loadingApplications = true;
  showRoleModal = false;
  selectedRole: 'TRAINER' | 'JUROR' | 'JURYLEITUNG' | null = null;
  selectedVereinId: number | null = null;
  applicationReason = '';
  applicationError = '';
  applicationSuccess = '';
  submittingApplication = false;

  openRoleModal(): void {
    this.showRoleModal = true;
    this.selectedRole = null;
    this.selectedVereinId = null;
    this.applicationReason = '';
    this.applicationError = '';
    this.applicationSuccess = '';
  }

  closeRoleModal(): void {
    if (this.submittingApplication) {
      return;
    }

    this.showRoleModal = false;
  }

  selectRole(role: 'TRAINER' | 'JUROR' | 'JURYLEITUNG'): void {
    this.selectedRole = role;
    this.applicationError = '';
  }

  ngOnInit(): void {
    this.loadRoleApplications();
  }

  loadRoleApplications(): void {
    this.authService.getMyRoleApplications().subscribe({
      next: (applications) => {
        this.roleApplications = applications;
        this.loadingApplications = false;
      },
      error: (error) => {
        console.error('Fehler beim Laden der Rollenbewerbungen:', error);
        this.loadingApplications = false;
      },
    });
  }
  submitRoleApplication(): void {
    if (!this.selectedRole) {
      this.applicationError = 'Bitte wähle eine Rolle aus.';
      return;
    }

    if (this.selectedRole === 'JUROR' && !this.selectedVereinId) {
      this.applicationError = 'Bitte wähle einen Verein aus.';
      return;
    }

    this.submittingApplication = true;
    this.applicationError = '';

    this.authService.createRoleApplication({
      role: this.selectedRole,
      vereinId:
        this.selectedRole === 'JUROR'
          ? this.selectedVereinId ?? undefined
          : undefined,
      reason: this.applicationReason || undefined,
    }).subscribe({
      next: () => {
        this.submittingApplication = false;
        this.applicationSuccess = 'Deine Bewerbung wurde erfolgreich eingereicht.';
        this.loadRoleApplications();

        setTimeout(() => {
          this.showRoleModal = false;
        }, 1000);
      },
      error: (error) => {
        this.submittingApplication = false;

        this.applicationError =
          error.error?.message ??
          'Die Bewerbung konnte nicht eingereicht werden.';
      },
    });
  }
}
