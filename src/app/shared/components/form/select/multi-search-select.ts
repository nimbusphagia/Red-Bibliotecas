import { booleanAttribute, Component, computed, input, model, output } from '@angular/core';
import type { FormValueControl, ValidationError } from '@angular/forms/signals';
import { Text } from '../../base/text';
import { FieldError } from '../field-error';
import { Chip } from './chip';
import type { Option } from './option';
import { SearchSelect } from './search-select';

/**
 * Varias opciones: se agregan con un SearchSelect y se quitan tocando el chip.
 * Con Signal Forms: `<app-multi-search-select [formField]="form.authors" ... />`.
 */
@Component({
  selector: 'app-multi-search-select',
  imports: [Chip, FieldError, SearchSelect, Text],
  host: { class: 'flex flex-col gap-4' },
  template: `
    @if (label()) {
      <span appText="item">{{ label() }}</span>
    }
    <app-search-select
      pickOnly
      [fetchOptions]="fetchOptions()"
      [placeholder]="placeholder()"
      [creatable]="creatable()"
      [disabled]="disabled()"
      (picked)="add($event)"
      (created)="created.emit($event)"
      (touch)="touch.emit()"
    />
    @if (value().length > 0) {
      <ul class="flex flex-wrap gap-3 rounded-lg bg-inset p-4" [attr.aria-label]="label()">
        @for (o of value(); track o.id) {
          <li class="contents">
            <button
              type="button"
              app-chip
              selected
              [detail]="o.detail"
              [attr.aria-label]="'Quitar ' + o.label"
              [disabled]="disabled()"
              (click)="remove(o)"
            >
              {{ o.label }}
            </button>
          </li>
        }
      </ul>
    }
    <app-field-error [message]="errorMessage()" />
  `,
})
export class MultiSearchSelect<Id extends string | number = number> implements FormValueControl<
  readonly Option<Id>[]
> {
  readonly value = model<readonly Option<Id>[]>([]);
  readonly label = input<string>();
  readonly fetchOptions = input.required<(search: string) => Promise<Option<Id>[]>>();
  readonly placeholder = input('Agregar...');
  readonly creatable = input(false, { transform: booleanAttribute });
  readonly created = output<string>();

  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly touch = output();

  protected readonly errorMessage = computed(() =>
    this.touched() && this.invalid()
      ? (this.errors().find((e) => e.message)?.message ?? null)
      : null,
  );

  protected add(option: Option<Id>) {
    if (!this.value().some((v) => v.id === option.id)) this.value.set([...this.value(), option]);
  }

  protected remove(option: Option<Id>) {
    this.value.set(this.value().filter((v) => v.id !== option.id));
    this.touch.emit();
  }
}
