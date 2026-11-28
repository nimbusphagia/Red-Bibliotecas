import { Component, computed, input, model } from '@angular/core';
import { LucideArrowDownZA, LucideArrowUpAZ } from '@lucide/angular';
import { Button } from '../base/button';

export type SortDirection = 'asc' | 'desc';

export interface SortOption<K extends string> {
  key: K;
  label: string;
  /** Dirección al elegir esta opción por primera vez. */
  defaultDir: SortDirection;
}

export interface Sort<K extends string> {
  by: K;
  dir: SortDirection;
}

/**
 * Orden en el toolbar: `<app-inline-sort [options] [(sort)]>`.
 * Tocar la opción elegida invierte la dirección.
 */
@Component({
  selector: 'app-inline-sort',
  imports: [Button],
  host: { role: 'group', class: 'flex flex-wrap gap-2' },
  template: `
    @for (o of options(); track o.key) {
      @let selected = o.key === sort().by;
      <button
        app-button
        type="button"
        size="sm"
        [variant]="selected ? 'active' : 'solid'"
        [weight]="selected ? 'md' : 'sm'"
        [icon]="selected ? arrow() : undefined"
        [attr.aria-pressed]="selected"
        [attr.aria-label]="selected ? o.label + ', ' + dirLabel() : null"
        (click)="choose(o)"
      >
        {{ o.label }}
      </button>
    }
  `,
})
export class InlineSort<K extends string> {
  readonly options = input.required<readonly SortOption<K>[]>();
  readonly sort = model.required<Sort<K>>();

  protected readonly arrow = computed(() =>
    this.sort().dir === 'asc' ? LucideArrowUpAZ : LucideArrowDownZA,
  );
  protected readonly dirLabel = computed(() =>
    this.sort().dir === 'asc' ? 'ascendente' : 'descendente',
  );

  protected choose(o: SortOption<K>) {
    const { by, dir } = this.sort();
    this.sort.set({
      by: o.key,
      dir: o.key === by ? (dir === 'asc' ? 'desc' : 'asc') : o.defaultDir,
    });
  }
}
