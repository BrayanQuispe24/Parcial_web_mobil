import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UserApiService } from '../services/userApi.service';

export const authGuardGuard: CanActivateFn = () => {
  const authService = inject(UserApiService);
  const router = inject(Router);

  const isLoggedIn = authService.dataAuth().token.length > 0;

  if (!isLoggedIn) {
    router.navigate(['/login']);
  }
  return isLoggedIn;
};
