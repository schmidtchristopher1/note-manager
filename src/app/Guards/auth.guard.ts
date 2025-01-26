import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const token = authService.getToken();

  if (!token) {
    return false;
    // const router = inject(Router);
    // router.navigate(['/login']);
  }
  
  return true;
};
