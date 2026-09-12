import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(public readonly authService: AuthService) { }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.currentUser.set(null);
      },
      error: () => {
        this.authService.currentUser.set(null);
      },
    });
  }
}
