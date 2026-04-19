// src/app/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.isLoggedIn()) return true;
  inject(Router).navigate(['/login']);
  return false;
};

// Role guard factory — use as: canActivate: [roleGuard('ADMIN')]
export const roleGuard = (requiredRole: string): CanActivateFn => () => {
  const auth = inject(AuthService);
  if (!auth.isLoggedIn()) {
    inject(Router).navigate(['/login']);
    return false;
  }
  const role = auth.getRole();
  if (role === requiredRole || role === 'SUPER_ADMIN') return true;
  inject(Router).navigate(['/dashboard']);
  return false;
};