import { Component, OnInit, signal } from '@angular/core';
import { AuthService, User } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  user = signal<User | null>(null);

  constructor(private readonly authService: AuthService) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        console.log('Aktueller Benutzer:', user);
        this.user.set(user);
      },
      error: (error) => {
        console.error('Kein eingeloggter Benutzer:', error);
      },
    });
  }
}

