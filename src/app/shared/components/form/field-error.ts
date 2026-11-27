import { Component, input } from '@angular/core';
import { status } from '../../theme';
import { Text } from '../base/text';

/** Mensaje de error de un campo o del formulario. Sin mensaje no dibuja nada. */
@Component({
  selector: 'app-field-error',
  imports: [Text],
  host: { class: 'contents' },
  template: `
    @if (message()) {
      <p appText="itemSm" [id]="messageId()" [class]="errorText" aria-live="polite">
        {{ message() }}
      </p>
    }
  `,
})
export class FieldError {
  readonly message = input<string | null>();
  /** Para enlazarlo con `aria-describedby` desde el campo. */
  readonly messageId = input<string>();

  protected readonly errorText = status.error.text;
}
