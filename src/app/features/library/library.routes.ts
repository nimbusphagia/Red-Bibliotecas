import { Routes } from '@angular/router';

const home = () => import('./library-home').then((m) => m.LibraryHome);

/** Bibliotecarios y staff de una institución. */
export const libraryRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./library-shell').then((m) => m.LibraryShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      { path: 'inicio', loadComponent: home },
      {
        path: 'libros',
        loadComponent: () => import('./books/book-list').then((m) => m.BookList),
      },
      // Temporal: las secciones que todavía no existen muestran el inicio.
      { path: '**', loadComponent: home },
    ],
  },
];
