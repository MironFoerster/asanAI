import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { map } from 'rxjs';

export const hasLabAccessGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const api = inject(ApiService)
  return api.get("get-access/"+route.paramMap.get("labId")).pipe(
    map((accessLevel: string) => {
        if (["owning", "writing", "viewing"].includes(accessLevel)) {
            return true
        } else {
            router.navigate(['/join']);
            return false
        }
    })
  )
};
