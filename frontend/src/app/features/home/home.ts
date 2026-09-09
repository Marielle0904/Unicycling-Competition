import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(
    public readonly authService: AuthService,
    private readonly router: Router,
  ) { }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.currentUser.set(null);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout fehlgeschlagen:', error);
      },
    });
  }
}
