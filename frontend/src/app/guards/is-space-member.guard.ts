import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { tap } from 'rxjs';

export const isSpaceMemberGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  return inject(ApiService).get("is-member/"+route.paramMap.get("labId")).pipe(
    tap((isMember: boolean) => {
        if (isMember) {
            return true
        } else {
            router.navigate(['/join']);
            return false
        }
    })
  )
};
