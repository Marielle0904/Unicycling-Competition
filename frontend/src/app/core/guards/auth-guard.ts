import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    map((user) => {
      authService.currentUser.set(user);
      return true;
    }),
    catchError(() => {
      authService.currentUser.set(null);
      return of(router.createUrlTree(['/login']));
    }),
  );
};
