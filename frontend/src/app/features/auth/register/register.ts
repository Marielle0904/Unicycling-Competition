import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterData } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  email = '';
  password = '';
  firstName = '';
  lastName = '';
  birthDate = '';

  registerError = signal('');
  registerSuccess = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) { }

  register(form: NgForm) {
    this.registerError.set('');
    this.registerSuccess.set(false);

    if (form.invalid) {
      return;
    }

    const data: RegisterData = {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: this.birthDate,
    };

    this.authService.register(data).subscribe({
      next: (user) => {
        console.log('Registrierung erfolgreich:', user);
        this.registerSuccess.set(true);
      },
      error: (error) => {
        console.error('Registrierung fehlgeschlagen:', error);
        this.registerError.set(
          'Registrierung fehlgeschlagen. Bitte überprüfe deine Eingaben.',
        );
      },
    });
  }
}
