import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../state/auth-store';

export const adminGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const user = authStore.currentUser();
  if (user && user.roles.some((r: any) => r.toUpperCase() === 'ADMIN')) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
