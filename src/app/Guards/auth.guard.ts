import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService)
  const token = authService.getToken();

  if (!token) {
    return false;
  }

  return true;
};
