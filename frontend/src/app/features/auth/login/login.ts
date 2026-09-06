import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private readonly authService: AuthService) { }

  testLogin() {
    this.authService
      .login('test@example.com', 'MeinTestPasswort123!')
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
