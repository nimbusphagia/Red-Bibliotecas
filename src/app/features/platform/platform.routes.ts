import { Routes } from '@angular/router';

/** Equipo de la plataforma: instituciones y su configuración. */
export const platformRoutes: Routes = [
  { path: '', loadComponent: () => import('./platform-home').then((m) => m.PlatformHome) },
];
