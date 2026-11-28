import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// Directo, no por el barril: el barril arrastraría todos los componentes al bundle inicial.
import { provideDialogDefaults } from './shared/components/base/dialog';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes), provideDialogDefaults()],
};
