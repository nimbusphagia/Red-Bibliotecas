import { Routes } from '@angular/router';

// Cada área se carga aparte: el código de una no se descarga desde la otra.
// Cuando exista la sesión, cada una lleva su `canMatch` por rol.
export const routes: Routes = [
  {
    path: 'plataforma',
    loadChildren: () => import('./features/platform/platform.routes').then((m) => m.platformRoutes),
  },
  // Temporal: vitrina de componentes hasta que existan las pantallas reales.
  { path: 'dev/ui', loadComponent: () => import('./dev/ui-preview').then((m) => m.UiPreview) },
  {
    path: '',
    loadChildren: () => import('./features/library/library.routes').then((m) => m.libraryRoutes),
  },
];
