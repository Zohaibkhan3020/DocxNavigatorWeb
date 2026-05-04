import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard = (): boolean | UrlTree => {
  const service = inject(AuthService);
  const router = inject(Router);

  if (service.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};