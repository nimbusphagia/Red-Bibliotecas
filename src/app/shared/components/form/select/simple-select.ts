import { _IdGenerator } from '@angular/cdk/a11y';
import { booleanAttribute, Component, computed, inject, input, model, output } from '@angular/core';
import type { FormValueControl, ValidationError } from '@angular/forms/signals';
import type { AccentLevel } from '../../../theme';
import { Text } from '../../base/text';
import { FieldError } from '../field-error';
import { Chip, ChipGroup } from './chip';

export interface SimpleOption<V extends string | number> {
  id: V;
  label: string;
  /** Color del chip cuando está elegido. */
  accent?: AccentLevel;
}

/**
 * Elegir una opción de pocas con chips. Tocar la elegida la quita (vuelve a
 * `null`). Con Signal Forms: `<app-simple-select [formField]="form.state" />`.
 */
@Component({
  selector: 'app-simple-select',
  imports: [Chip, ChipGroup, FieldError, Text],
  host: { class: 'flex flex-col gap-3', '[class.opacity-80]': 'disabled()' },
  template: `
    <span appText="item" [id]="labelId">{{ label() }}</span>
    <app-chip-group role="group" [attr.aria-labelledby]="labelId">
      @for (o of options(); track o.id) {
        <button
          type="button"
          app-chip
          [selected]="o.id === value()"
          [accent]="o.id === value() ? o.accent : undefined"
          [attr.aria-pressed]="o.id === value()"
          [disabled]="disabled()"
          (click)="toggle(o.id)"
        >
          {{ o.label }}
        </button>
      }
    </app-chip-group>
    <app-field-error [message]="errorMessage()" />
  `,
})
export class SimpleSelect<V extends string | number> implements FormValueControl<V | null> {
  readonly value = model<V | null>(null);
  readonly label = input.required<string>();
  readonly options = input.required<readonly SimpleOption<V>[]>();

  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly touch = output();

  protected readonly labelId = inject(_IdGenerator).getId('app-simple-select-');
  protected readonly errorMessage = computed(() =>
    this.touched() && this.invalid()
      ? (this.errors().find((e) => e.message)?.message ?? null)
      : null,
  );

  protected toggle(id: V) {
    this.value.set(id === this.value() ? null : id);
    this.touch.emit();
  }
}
