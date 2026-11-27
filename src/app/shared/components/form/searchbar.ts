import { Component, input, model } from '@angular/core';
import { LucideSearch } from '@lucide/angular';
import { Icon } from '../base/icon';

/**
 * Buscador sobre el nivel 2 de la superficie actual (`bg-inset`).
 * `<app-searchbar [(value)]="query" />`. El debounce lo hace quien lo usa.
 */
@Component({
  selector: 'app-searchbar',
  imports: [Icon],
  host: {
    class:
      'flex h-11 w-full max-w-100 items-center gap-2 rounded-lg bg-inset px-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent-lg',
  },
  template: `
    <input
      #input
      type="search"
      class="h-full min-w-0 flex-1 bg-transparent font-sans text-fg outline-none placeholder:text-faint [&::-webkit-search-cancel-button]:appearance-none"
      [value]="value()"
      (input)="value.set(input.value)"
      [placeholder]="placeholder()"
      [attr.aria-label]="label()"
    />
    <app-icon [icon]="searchIcon" />
  `,
})
export class Searchbar {
  readonly value = model('');
  readonly placeholder = input('Buscar...');
  /** Nombre accesible; el placeholder no cuenta como etiqueta. */
  readonly label = input('Buscar');

  protected readonly searchIcon = LucideSearch;
}
