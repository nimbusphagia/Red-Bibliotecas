import { _IdGenerator } from '@angular/cdk/a11y';
import { booleanAttribute, Component, computed, inject, input, output } from '@angular/core';
import { cn, status } from '../../theme';
import { LabeledItem, type LabelWidth } from '../list/labeled-item';
import { FieldError } from './field-error';

/**
 * Campo que se elige en otra parte (un diálogo de selección): muestra la
 * etiqueta y el valor actual, y al hacer click emite `(opened)`.
 */
@Component({
  selector: 'app-field-row',
  imports: [FieldError, LabeledItem],
  host: { class: 'flex flex-col gap-1' },
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled()"
      [attr.aria-invalid]="error() ? true : null"
      [attr.aria-describedby]="error() ? errorId : null"
      (click)="opened.emit()"
    >
      <app-labeled-item
        variant="input"
        [label]="label()"
        [content]="value()"
        [labelWidth]="labelWidth()"
      />
    </button>
    <app-field-error [message]="error()" [messageId]="errorId" />
  `,
})
export class FieldRow {
  readonly label = input.required<string>();
  readonly value = input<string | null>();
  readonly error = input<string | null>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly labelWidth = input<LabelWidth>('form');
  readonly opened = output();

  protected readonly errorId = inject(_IdGenerator).getId('app-field-row-error-');

  protected readonly buttonClasses = computed(() =>
    cn(
      'block w-full cursor-pointer rounded-lg border text-left',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-lg',
      'disabled:cursor-not-allowed disabled:opacity-80',
      this.error() ? status.error.border : 'border-transparent',
    ),
  );
}
