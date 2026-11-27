import { Routes } from '@angular/router';

export const routes: Routes = [
  // Temporal: vitrina de componentes hasta que existan las pantallas reales.
  { path: '', loadComponent: () => import('./dev/ui-preview').then((m) => m.UiPreview) },
];
