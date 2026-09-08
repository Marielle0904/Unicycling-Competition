import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

  constructor(private readonly authService: AuthService) { }

  login() {
    this.authService
      .login(this.email, this.password)
      .subscribe({
        next: (user) => {
          console.log('Login erfolgreich:', user);
        },
        error: (error) => {
          console.error('Login fehlgeschlagen:', error);
        },
      });
  }
}

