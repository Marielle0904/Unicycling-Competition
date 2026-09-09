import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  loginError = signal('');

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) { }

  login(form: NgForm) {
    this.loginError.set('');

    if (form.invalid) {
      return;
    }

    this.authService
      .login(this.email, this.password)
      .subscribe({
        next: (user) => {
          console.log('Login erfolgreich:', user);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login fehlgeschlagen:', error);
          this.loginError.set('E-Mail oder Passwort ist falsch.');
        },
      });
  }
}
