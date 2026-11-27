import { Routes } from '@angular/router';

/** Bibliotecarios y staff de una institución. */
export const libraryRoutes: Routes = [
  { path: '', loadComponent: () => import('./library-home').then((m) => m.LibraryHome) },
];
