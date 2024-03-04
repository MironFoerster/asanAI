import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const notAuthenticatedGuard: CanActivateFn = (route, state) => {
  if (!inject(AuthService).isAuthenticated()) {
    return true;
  } else {
    inject(Router).navigate(['']);
    return false;
  }
};
