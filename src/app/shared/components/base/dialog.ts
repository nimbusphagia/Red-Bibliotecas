import { DEFAULT_DIALOG_CONFIG, DialogRef, type DialogConfig } from '@angular/cdk/dialog';
import { booleanAttribute, Component, computed, inject, input, output } from '@angular/core';
import type { Provider } from '@angular/core';
import { cn, type Tone } from '../../theme';
import { Button } from './button';
import { Surface } from './surface';
import { Text } from './text';

/**
 * Defaults para `inject(Dialog).open(...)` de @angular/cdk/dialog: fondo
 * tenue, foco en el primer control, Escape y click afuera cierran, y el foco
 * vuelve a quien lo abrió. Se registra una vez en app.config.ts.
 */
export function provideDialogDefaults(): Provider {
  return {
    provide: DEFAULT_DIALOG_CONFIG,
    useValue: {
      hasBackdrop: true,
      backdropClass: 'bg-black/10',
      panelClass: 'max-w-[calc(100vw-2rem)]',
      autoFocus: 'first-tabbable',
      restoreFocus: true,
    } satisfies DialogConfig,
  };
}

type DialogSize = 'sm' | 'md' | 'lg';

const sizeStyles: Record<DialogSize, string> = {
  sm: 'w-100',
  md: 'w-120',
  lg: 'h-[70vh] w-140',
};

/**
 * Marco de un diálogo: el componente que se abre con `Dialog.open` lo usa
 * como raíz de su template.
 *
 * ```html
 * <app-dialog size="sm">
 *   <app-dialog-header title="Nuevo estante" />
 *   <app-dialog-body>...</app-dialog-body>
 *   <app-dialog-actions confirmLabel="Guardar" (confirm)="save()" />
 * </app-dialog>
 * ```
 */
@Component({
  selector: 'app-dialog',
  imports: [Surface],
  template: `
    <section appSurface [tone]="tone()" [class]="classes()" role="dialog" aria-modal="true">
      <ng-content />
    </section>
  `,
})
export class DialogShell {
  readonly size = input<DialogSize>('md');
  /** Tono de la superficie del diálogo. Todo lo de adentro lo hereda. */
  readonly tone = input<Tone>('light');
  readonly class = input<string>();

  protected readonly classes = computed(() =>
    cn(
      'flex max-h-[80vh] max-w-full flex-col gap-4 p-6 pt-4',
      sizeStyles[this.size()],
      this.class(),
    ),
  );
}

/** Título, subtítulo y acciones opcionales (contenido proyectado, a la derecha). */
@Component({
  selector: 'app-dialog-header',
  imports: [Text],
  host: { class: 'flex items-center justify-between gap-4' },
  template: `
    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <h2 appText="section" class="truncate">{{ title() }}</h2>
      @if (subtitle()) {
        <p appText="caption" class="truncate">{{ subtitle() }}</p>
      }
    </div>
    <div class="flex items-center gap-2 empty:hidden">
      <ng-content />
    </div>
  `,
})
export class DialogHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}

/**
 * Contenido con scroll propio: el encabezado y las acciones quedan fijos.
 * `-m-1 p-1`: el scroll recortaría el contorno de foco de los campos.
 */
@Component({
  selector: 'app-dialog-body',
  host: { class: '-m-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-1' },
  template: `<ng-content />`,
})
export class DialogBody {}

/** Cancelar (cierra el diálogo) + confirmar. */
@Component({
  selector: 'app-dialog-actions',
  imports: [Button],
  host: { class: 'flex items-center justify-end gap-2' },
  template: `
    @if (!hideCancel()) {
      <button app-button type="button" [variant]="cancelVariant()" (click)="onCancel()">
        {{ cancelLabel() }}
      </button>
    }
    <button
      app-button
      type="button"
      variant="soft"
      weight="md"
      [loading]="loading()"
      [disabled]="disabled()"
      (click)="confirmed.emit()"
    >
      {{ confirmLabel() }}
    </button>
  `,
})
export class DialogActions {
  private readonly ref = inject(DialogRef, { optional: true });

  readonly confirmLabel = input.required<string>();
  readonly cancelLabel = input('Cancelar');
  readonly cancelVariant = input<'soft' | 'ghost'>('soft');
  readonly hideCancel = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly confirmed = output();
  readonly cancelled = output();

  protected onCancel() {
    this.cancelled.emit();
    this.ref?.close();
  }
}
