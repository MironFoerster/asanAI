import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { map } from 'rxjs';

export const hasLabAccessGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const api = inject(ApiService)
  return api.get("lab-authorization/"+route.paramMap.get("labId")).pipe(
    map((authorization: string) => {
        if (["owning", "viewing"].includes(authorization)) {
            return true
        } else {
            router.navigate(['/404']);
            return false
        }
    })
  )
};
