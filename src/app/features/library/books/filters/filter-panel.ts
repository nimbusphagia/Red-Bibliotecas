import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, computed, inject, resource, type WritableSignal } from '@angular/core';
import {
  Button,
  DialogBody,
  DialogHeader,
  DialogShell,
  SearchSelect,
  SimpleSelect,
  type Option,
} from '../../../../shared/components';
import type { BookListParams } from '../book';
import { BookService } from '../book.service';

export interface CatalogFilters {
  author?: Option;
  publisher?: Option;
  series?: Option;
  categoryId?: number;
  subcategoryId?: number;
  collectionId?: number;
}

export const toBookParams = (f: CatalogFilters): Partial<BookListParams> => ({
  authorId: f.author?.id,
  publisherId: f.publisher?.id,
  seriesId: f.series?.id,
  categoryId: f.categoryId,
  subcategoryId: f.subcategoryId,
  collectionId: f.collectionId,
});

export type FilterField = 'author' | 'publisher' | 'category' | 'subcategory';

/** Campos que el panel completo ("all") muestra, y botones rápidos en pantallas anchas. */
export const PANEL_FIELDS: readonly FilterField[] = [
  'author',
  'publisher',
  'category',
  'subcategory',
];

/** Qué abrir: el panel completo o un solo campo. */
export type FilterDialog = FilterField | 'all';

export interface FilterPanelData {
  filters: WritableSignal<CatalogFilters>;
  open: FilterDialog;
}

/**
 * Diálogo de filtros del catálogo: `inject(Dialog).open(FilterPanel, { data })`.
 * Con un solo campo, elegir un valor cierra el diálogo; el panel completo
 * queda abierto y agrega serie (con autor) y colección (con editorial).
 */
@Component({
  selector: 'app-filter-panel',
  imports: [Button, DialogBody, DialogHeader, DialogShell, SearchSelect, SimpleSelect],
  template: `
    @let f = filters();
    <app-dialog [size]="all ? 'md' : 'sm'">
      @if (all) {
        <app-dialog-header title="Filtros">
          <button app-button type="button" variant="soft" (click)="filters.set({})">Limpiar</button>
        </app-dialog-header>
      }
      <app-dialog-body>
        @if (shows('author')) {
          <app-search-select
            label="Autor"
            [value]="f.author ?? null"
            (valueChange)="set({ author: $event ?? undefined, series: undefined })"
            [fetchOptions]="searchAuthors"
          />
        }
        @if (shows('publisher')) {
          <app-search-select
            label="Editorial"
            [value]="f.publisher ?? null"
            (valueChange)="set({ publisher: $event ?? undefined, collectionId: undefined })"
            [fetchOptions]="searchPublishers"
          />
        }
        @if (all && f.author) {
          <app-search-select
            label="Serie"
            [value]="f.series ?? null"
            (valueChange)="set({ series: $event ?? undefined })"
            [fetchOptions]="searchSeries()"
          />
        }
        @if (all && collections.value().length) {
          <app-simple-select
            label="Colección"
            [options]="collections.value()"
            [value]="f.collectionId ?? null"
            (valueChange)="set({ collectionId: $event ?? undefined })"
          />
        }
        @if (shows('category')) {
          <app-simple-select
            label="Categoría"
            [options]="categories.value()"
            [value]="f.categoryId ?? null"
            (valueChange)="set({ categoryId: $event ?? undefined })"
          />
        }
        @if (shows('subcategory')) {
          <app-simple-select
            label="Subcategoría"
            [options]="subcategories.value()"
            [value]="f.subcategoryId ?? null"
            (valueChange)="set({ subcategoryId: $event ?? undefined })"
          />
        }
      </app-dialog-body>
    </app-dialog>
  `,
})
export class FilterPanel {
  private readonly books = inject(BookService);
  private readonly ref = inject(DialogRef);
  private readonly data = inject<FilterPanelData>(DIALOG_DATA);

  protected readonly filters = this.data.filters;
  protected readonly all = this.data.open === 'all';

  protected readonly searchAuthors = (s: string) => this.books.searchAuthors(s);
  protected readonly searchPublishers = (s: string) => this.books.searchPublishers(s);
  // Una función nueva por autor: así SearchSelect vuelve a pedir al cambiarlo.
  private readonly authorId = computed(() => this.filters().author?.id);
  protected readonly searchSeries = computed(() => {
    const authorId = this.authorId();
    return (s: string) =>
      authorId === undefined ? Promise.resolve([]) : this.books.searchSeries(s, authorId);
  });

  protected readonly categories = resource({
    loader: () => this.books.categories(),
    defaultValue: [],
  });
  protected readonly subcategories = resource({
    loader: () => this.books.subcategories(),
    defaultValue: [],
  });
  private readonly publisherId = computed(() => this.filters().publisher?.id);
  protected readonly collections = resource({
    params: () => this.publisherId(),
    loader: ({ params }) => this.books.collections(params),
    defaultValue: [],
  });

  protected shows(field: FilterField) {
    return (this.all && PANEL_FIELDS.includes(field)) || this.data.open === field;
  }

  protected set(patch: Partial<CatalogFilters>) {
    this.filters.update((f) => ({ ...f, ...patch }));
    if (!this.all) this.ref.close();
  }
}
