import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { map } from 'rxjs';

export const newLabGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  // authenticated users: create a new lab object in the database
  // unauthenticated users: continue to anonymous lab
  if (inject(AuthService).isAuthenticated()) { //TODO: maybe also for authenticated start with anonymous lab and ask in the end for naming and saving?
    // when creting lab from something directly create new lab
    // they can always delete the lab
    return inject(ApiService).get("new-lab").pipe(
      map((newLabId: string) => {
        router.navigate(["lab", newLabId], {queryParams: route.queryParams})
        return false
      }))
  } else {
    return true;
  }
};
