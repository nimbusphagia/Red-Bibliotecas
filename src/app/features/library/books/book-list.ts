import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucidePlus, LucideStamp } from '@lucide/angular';
import {
  Button,
  InlineSort,
  injectLayoutMode,
  ItemList,
  ItemTemplate,
  PageHeader,
  Searchbar,
  type Sort,
  type SortOption,
} from '../../../shared/components';
import { debounced } from '../../../shared/utils/debounced';
import { infiniteList, PAGE_SIZE } from '../../../shared/utils/infinite-list';
import type { BookSort } from './book';
import { BookCard } from './book-card';
import { BookService } from './book.service';
import {
  FilterPanel,
  PANEL_FIELDS,
  toBookParams,
  type CatalogFilters,
  type FilterDialog,
  type FilterPanelData,
} from './filters/filter-panel';
import { QuickFilters } from './filters/quick-filters';

const SORTS: SortOption<BookSort>[] = [
  { key: 'title', label: 'Título', defaultDir: 'asc' },
  { key: 'author', label: 'Autor', defaultDir: 'asc' },
  { key: 'publisher', label: 'Editorial', defaultDir: 'asc' },
];

@Component({
  selector: 'app-book-list',
  imports: [
    BookCard,
    Button,
    InlineSort,
    ItemList,
    ItemTemplate,
    PageHeader,
    QuickFilters,
    RouterLink,
    Searchbar,
  ],
  host: { class: 'flex min-h-0 flex-1 flex-col gap-6 p-8' },
  template: `
    <app-page-header title="Libros" subtitle="Cataloga y explora tu biblioteca">
      <app-searchbar
        search
        [(value)]="search"
        placeholder="Buscar por título, autor o editorial..."
      />
      <div lead class="flex gap-2">
        <a app-button routerLink="tejuelos" size="sm" weight="md" [icon]="icons.stamp">Tejuelos</a>
        <a app-button routerLink="nuevo" size="sm" weight="md" [icon]="icons.plus">Nuevo</a>
      </div>
    </app-page-header>

    <app-item-list
      [items]="list.items()"
      [loading]="list.loading()"
      [error]="list.error()"
      [columns]="3"
      [compactColumns]="2"
      (endReached)="list.loadMore()"
    >
      <app-quick-filters
        toolbar
        [filters]="filters()"
        [fields]="layout.isExpanded() ? panelFields : []"
        (opened)="openFilters($event)"
      />
      <app-inline-sort toolbar [options]="sorts" [(sort)]="sort" />
      <ng-template appItem [appItemOf]="list.items()" let-book>
        <app-book-card [book]="book" />
      </ng-template>
    </app-item-list>
  `,
})
export class BookList {
  private readonly books = inject(BookService);
  private readonly dialog = inject(Dialog);
  protected readonly layout = injectLayoutMode();

  protected readonly icons = { plus: LucidePlus, stamp: LucideStamp };
  protected readonly sorts = SORTS;
  protected readonly panelFields = PANEL_FIELDS;

  protected readonly search = signal('');
  private readonly query = debounced(this.search);
  protected readonly filters = signal<CatalogFilters>({});
  protected readonly sort = signal<Sort<BookSort>>({ by: 'title', dir: 'asc' });

  protected readonly list = infiniteList({
    params: () => ({
      ...toBookParams(this.filters()),
      search: this.query(),
      sortBy: this.sort().by,
      sortDir: this.sort().dir,
    }),
    loader: (params, offset) => this.books.list({ ...params, limit: PAGE_SIZE, offset }),
  });

  protected openFilters(open: FilterDialog) {
    this.dialog.open(FilterPanel, {
      data: { filters: this.filters, open } satisfies FilterPanelData,
    });
  }
}
