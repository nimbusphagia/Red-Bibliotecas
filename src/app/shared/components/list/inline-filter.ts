import { Component, input, model } from '@angular/core';
import type { AccentLevel } from '../../theme';
import { Button } from '../base/button';

export interface FilterOption<V extends string> {
  value: V;
  label: string;
  /** Color de la opción cuando está activa. */
  accent?: AccentLevel;
}

/** Filtro de una sola opción en el toolbar: `<app-inline-filter [options] [(value)]>`. */
@Component({
  selector: 'app-inline-filter',
  imports: [Button],
  host: { role: 'group', class: 'flex flex-wrap gap-2' },
  template: `
    @for (o of options(); track o.value) {
      @let selected = o.value === value();
      <button
        app-button
        type="button"
        size="sm"
        [variant]="selected ? 'active' : 'soft'"
        [accent]="selected ? o.accent : undefined"
        [attr.aria-pressed]="selected"
        (click)="value.set(o.value)"
      >
        {{ o.label }}
      </button>
    }
  `,
})
export class InlineFilter<V extends string> {
  readonly options = input.required<readonly FilterOption<V>[]>();
  readonly value = model.required<V>();
}
