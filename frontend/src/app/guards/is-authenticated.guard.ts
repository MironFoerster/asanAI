import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const auth = inject(AuthService)
  if (auth.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['signin'], {queryParams: {returnRoute: state.url}});
    return false;
  }
};
