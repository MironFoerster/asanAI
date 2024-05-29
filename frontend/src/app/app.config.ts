import { ApplicationConfig } from '@angular/core';
import { RouterModule, provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { urlInterceptor } from './url.interceptor';
import { tokenInterceptor } from './token.interceptor';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        urlInterceptor,
        tokenInterceptor
      ])
      ),
    FormsModule,
    RouterModule
  ]
};
