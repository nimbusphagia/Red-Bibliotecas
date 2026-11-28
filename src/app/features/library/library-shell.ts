import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContentArea, Sidebar } from '../../shared/components';
import { LIBRARY_NAV } from './navigation';

/**
 * Menú lateral + contenido del área de biblioteca. `appContentArea` va en
 * este template (no en un componente que proyecte el outlet) para que las
 * páginas lo encuentren al inyectar: la inyección sigue a quien declara, no
 * a donde se proyecta.
 */
@Component({
  selector: 'app-library-shell',
  imports: [ContentArea, RouterOutlet, Sidebar],
  host: { class: 'flex h-dvh' },
  template: `
    <app-sidebar [nav]="nav" />
    <main appContentArea class="flex min-h-0 min-w-0 flex-1 flex-col">
      <router-outlet />
    </main>
  `,
})
export class LibraryShell {
  protected readonly nav = LIBRARY_NAV;
}
