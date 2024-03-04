import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';


export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService)
  let tokenizedReq = req.clone({
    setHeaders: {
      Authorization: 'Token '+auth.getToken()
    }
  })
  return next(tokenizedReq);
};
