import { Component, input } from '@angular/core';
import { Text } from './text';

/**
 * Encabezado de página. Slots: `[search]` (buscador: al lado del título en
 * pantallas anchas, debajo en angostas), el contenido por defecto (acciones a
 * la derecha) y `[lead]` (al final de la fila).
 */
@Component({
  selector: 'app-page-header',
  imports: [Text],
  host: { class: 'flex flex-wrap items-center gap-x-4 gap-y-3' },
  template: `
    <div>
      <h1 appText="title">{{ title() }}</h1>
      @if (subtitle()) {
        <p appText="captionXs">{{ subtitle() }}</p>
      }
    </div>
    <div class="order-last w-full lg:order-0 lg:ml-auto lg:w-auto lg:max-w-130 lg:flex-1">
      <ng-content select="[search]" />
    </div>
    <div class="ml-auto flex items-center justify-end gap-4 lg:ml-0">
      <ng-content />
    </div>
    <ng-content select="[lead]" />
  `,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
