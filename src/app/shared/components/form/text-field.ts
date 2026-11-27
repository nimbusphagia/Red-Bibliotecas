import { _IdGenerator } from '@angular/cdk/a11y';
import {
  booleanAttribute,
  Component,
  computed,
  type ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { FormValueControl, ValidationError } from '@angular/forms/signals';
import { cn, status } from '../../theme';
import { Text } from '../base/text';
import { FieldError } from './field-error';

type InputType = 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';

/**
 * Campo de texto con etiqueta, error y ayuda. Se usa con Signal Forms:
 * `<app-text-field label="Nombre" [formField]="form.name" />`. El directivo
 * le pasa valor, errores y estados; el error se muestra cuando el campo fue
 * tocado (al salir de él o al enviar el formulario).
 * Con `type="password"` agrega el botón Mostrar/Ocultar.
 */
@Component({
  selector: 'app-text-field',
  imports: [FieldError, Text],
  host: {
    class: 'flex w-full flex-col gap-2',
    '[class.opacity-80]': 'disabled() || readonly()',
  },
  template: `
    @if (label()) {
      <label appText="item" [for]="id">{{ label() }}</label>
    }
    <div class="relative flex items-center">
      <input
        #input
        [id]="id"
        [type]="inputType()"
        [value]="value()"
        (input)="value.set(input.value)"
        (blur)="touch.emit()"
        [disabled]="disabled()"
        [readOnly]="readonly()"
        [required]="required()"
        [attr.name]="name() || null"
        [attr.placeholder]="placeholder() || null"
        [attr.autocomplete]="autocomplete() || null"
        [attr.aria-label]="label() ? null : placeholder() || null"
        [attr.aria-invalid]="showError() || null"
        [attr.aria-describedby]="describedBy()"
        [class]="inputClasses()"
      />
      @if (type() === 'password') {
        <button
          type="button"
          class="absolute right-3 cursor-pointer rounded px-1 py-2 text-[13px] text-faint focus-visible:outline-2 focus-visible:outline-accent-lg"
          [attr.aria-label]="visible() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
          (click)="visible.set(!visible())"
        >
          {{ visible() ? 'Ocultar' : 'Mostrar' }}
        </button>
      }
    </div>
    <app-field-error [message]="errorMessage()" [messageId]="errorId" />
    @if (!errorMessage() && helperText()) {
      <p appText="caption" [id]="helperId">{{ helperText() }}</p>
    }
  `,
})
export class TextField implements FormValueControl<string> {
  readonly value = model('');
  readonly label = input<string>();
  readonly type = input<InputType>('text');
  readonly placeholder = input<string>();
  readonly helperText = input<string>();
  readonly autocomplete = input<string>();

  // Estados que pone [formField]; también se pueden pasar a mano.
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly name = input('');
  readonly touch = output();

  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');
  protected readonly visible = signal(false);

  protected readonly id = inject(_IdGenerator).getId('app-text-field-');
  protected readonly errorId = `${this.id}-error`;
  protected readonly helperId = `${this.id}-helper`;

  protected readonly inputType = computed(() =>
    this.type() === 'password' && this.visible() ? 'text' : this.type(),
  );
  protected readonly showError = computed(() => this.touched() && this.invalid());
  protected readonly errorMessage = computed(() =>
    this.showError() ? (this.errors().find((e) => e.message)?.message ?? null) : null,
  );
  protected readonly describedBy = computed(() =>
    this.errorMessage() ? this.errorId : this.helperText() ? this.helperId : null,
  );

  protected readonly inputClasses = computed(() =>
    cn(
      'h-12 w-full rounded-lg border bg-inset px-4 font-sans text-fg placeholder:text-faint',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-lg',
      'disabled:cursor-not-allowed',
      this.showError() ? status.error.border : 'border-transparent',
      this.type() === 'password' && 'pr-24',
    ),
  );

  /** Signal Forms lo llama para enfocar el campo (p. ej. el primero con error). */
  focus(options?: FocusOptions) {
    this.input().nativeElement.focus(options);
  }
}
