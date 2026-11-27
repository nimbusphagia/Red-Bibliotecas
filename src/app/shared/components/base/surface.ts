import {
  booleanAttribute,
  Component,
  computed,
  Directive,
  forwardRef,
  inject,
  InjectionToken,
  input,
  type Signal,
} from '@angular/core';
import type { LucideIconInput } from '@lucide/angular';
import type { Tone } from '../../theme';
import { Icon } from './icon';
import { Text } from './text';

/** El tono de la Surface más cercana. Sin ninguna arriba, es el lienzo (canvas). */
export abstract class ToneScope {
  abstract readonly resolvedTone: Signal<Tone>;
}

/**
 * Fondo + tono. Todo lo que se dibuje dentro toma sus colores de aquí
 * (por CSS: las variables del tono se heredan).
 * Sin `tone` hereda el del padre (útil con `inset`), salvo un contenedor
 * directo sobre el lienzo canvas, que pasa a light.
 * Contenedores: rounded-2xl. Con `inset` o `row`: rounded-lg (es una fila/control).
 */
@Directive({
  selector: '[appSurface]',
  providers: [{ provide: ToneScope, useExisting: forwardRef(() => Surface) }],
  host: {
    '[attr.data-tone]': 'resolvedTone()',
    '[class]': 'classes()',
  },
})
export class Surface implements ToneScope {
  readonly tone = input<Tone>();
  /**
   * Nivel 2 dentro de la superficie actual (dark-solid en dark-1, bg en light-1).
   * No cambia el tono: el texto y los íconos siguen igual.
   */
  readonly inset = input(false, { transform: booleanAttribute });
  /** Fila de ItemList con gap: fondo opcional `bg-row`. Tampoco cambia el tono. */
  readonly row = input(false, { transform: booleanAttribute });

  private readonly parent = inject(ToneScope, { skipSelf: true, optional: true });

  readonly resolvedTone = computed<Tone>(() => {
    const current = this.parent?.resolvedTone() ?? 'canvas';
    const own = this.tone();
    if (own) return own;
    return current === 'canvas' && !this.inset() && !this.row() ? 'light' : current;
  });

  protected readonly classes = computed(() =>
    this.inset()
      ? 'bg-inset rounded-lg'
      : this.row()
        ? 'bg-row rounded-lg'
        : 'bg-surface rounded-2xl',
  );
}

/** Dentro de un Panel (sección con encabezado): las listas van más compactas. */
export const IN_SECTION = new InjectionToken<boolean>('IN_SECTION', { factory: () => false });

/** Surface con encabezado (título y acción opcional en el slot `[lead]`). */
@Component({
  selector: 'app-panel',
  imports: [Icon, Text],
  hostDirectives: [{ directive: Surface, inputs: ['tone'] }],
  providers: [{ provide: IN_SECTION, useValue: true }],
  host: { class: 'flex flex-col gap-2 p-5' },
  template: `
    @if (title()) {
      <div class="mb-2 flex items-center justify-between gap-4">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            @if (icon(); as icon) {
              <app-icon [icon]="icon" size="lg" stroke="sm" />
            }
            <h2 appText="section" [class]="titleClass()">{{ title() }}</h2>
          </div>
          @if (subtitle()) {
            <p appText="caption">{{ subtitle() }}</p>
          }
        </div>
        <!-- Margen negativo: el lead (p. ej. un botón) no agranda el encabezado,
          así el título queda igual con o sin acción. -->
        <div class="-my-2 flex flex-1 justify-end">
          <ng-content select="[lead]" />
        </div>
      </div>
    }
    <ng-content />
  `,
})
export class Panel {
  readonly title = input<string>();
  readonly subtitle = input<string>();
  readonly icon = input<LucideIconInput>();
  readonly titleClass = input<string>();
}
