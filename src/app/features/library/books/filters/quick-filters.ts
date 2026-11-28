import { Component, computed, inject, input, output, resource } from '@angular/core';
import { LucideSlidersHorizontal } from '@lucide/angular';
import { ActiveCounter, Button, IconButton, type Option } from '../../../../shared/components';
import { BookService } from '../book.service';
import {
  PANEL_FIELDS,
  type CatalogFilters,
  type FilterDialog,
  type FilterField,
} from './filter-panel';

const labelOf = (options: readonly Option[], id?: number) =>
  options.find((o) => o.id === id)?.label;

/**
 * Botón del panel de filtros (con la cantidad activa) y, si hay `fields`, un
 * botón por campo con su valor elegido. Emite qué abrir; el diálogo lo abre
 * la página.
 */
@Component({
  selector: 'app-quick-filters',
  imports: [ActiveCounter, Button, IconButton],
  host: { class: 'flex min-w-0 shrink items-center gap-4' },
  template: `
    <span class="relative">
      <button
        app-icon-button
        type="button"
        size="sm"
        weight="lg"
        [icon]="panelIcon"
        aria-label="Filtros"
        (click)="opened.emit('all')"
      ></button>
      @if (activeCount() > 0) {
        <app-active-counter [count]="activeCount()" />
      }
    </span>
    @if (buttons().length) {
      <div class="flex min-w-0 [scrollbar-width:none] gap-2 overflow-x-auto">
        @for (b of buttons(); track b.field) {
          <button
            app-button
            type="button"
            size="sm"
            class="shrink-0"
            [variant]="b.active ? 'accent' : 'selector'"
            (click)="opened.emit(b.field)"
          >
            {{ b.label }}
          </button>
        }
      </div>
    }
  `,
})
export class QuickFilters {
  private readonly books = inject(BookService);

  readonly filters = input.required<CatalogFilters>();
  readonly fields = input<readonly FilterField[]>(PANEL_FIELDS);
  readonly opened = output<FilterDialog>();

  protected readonly panelIcon = LucideSlidersHorizontal;

  private readonly categories = resource({
    loader: () => this.books.categories(),
    defaultValue: [],
  });
  private readonly subcategories = resource({
    loader: () => this.books.subcategories(),
    defaultValue: [],
  });

  protected readonly activeCount = computed(
    () => Object.values(this.filters()).filter((v) => v !== undefined).length,
  );

  protected readonly buttons = computed(() => {
    const f = this.filters();
    const all: { field: FilterField; label: string; active: boolean }[] = [
      { field: 'author', label: f.author?.label ?? 'Autor', active: !!f.author },
      { field: 'publisher', label: f.publisher?.label ?? 'Editorial', active: !!f.publisher },
      {
        field: 'category',
        label: labelOf(this.categories.value(), f.categoryId) ?? 'Categoría',
        active: f.categoryId !== undefined,
      },
      {
        field: 'subcategory',
        label: labelOf(this.subcategories.value(), f.subcategoryId) ?? 'Subcategoría',
        active: f.subcategoryId !== undefined,
      },
    ];
    return all.filter((b) => this.fields().includes(b.field));
  });
}
