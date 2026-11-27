import { booleanAttribute, Component, computed, input } from '@angular/core';
import { LucideDot, type LucideIconInput } from '@lucide/angular';
import { accents, cn, type AccentLevel } from '../../../theme';
import { Icon, type IconTone } from '../../base/icon';

const shapes = {
  default: 'rounded-lg px-4 py-1.5',
  pill: 'h-7 rounded-full px-4',
  circle: 'size-7 justify-center rounded-full',
} as const;
export type ChipShape = keyof typeof shapes;

/**
 * Chip de opción o de valor; el texto va como contenido:
 * `<button app-chip selected>Activo</button>`. Sobre `<button>` es elegible (el estado
 * accesible, p. ej. `aria-pressed`, lo pone quien lo usa); sobre `<span>` es
 * solo informativo.
 */
@Component({
  selector: 'button[app-chip], span[app-chip]',
  imports: [Icon],
  host: { '[class]': 'classes()' },
  template: `
    <span [class]="textClass()"><ng-content /></span>
    @if (detail() || detailIcon()) {
      <app-icon [icon]="dot" [tone]="dotTone()" />
    }
    @if (detailIcon(); as icon) {
      <app-icon [icon]="icon" />
    }
    @if (detail()) {
      <span [class]="textClass()">{{ detail() }}</span>
    }
  `,
})
export class Chip {
  readonly detail = input<string>();
  readonly detailIcon = input<LucideIconInput>();
  readonly selected = input(false, { transform: booleanAttribute });
  readonly shape = input<ChipShape>('default');
  /** Reemplaza los colores de idle/selected. */
  readonly accent = input<AccentLevel>();

  protected readonly dot = LucideDot;

  private readonly compact = computed(() => this.shape() !== 'default');

  protected readonly classes = computed(() => {
    const accent = this.accent();
    return cn(
      'inline-flex shrink-0 items-center select-none',
      '[&:is(button)]:cursor-pointer [&:is(button)]:active:opacity-80',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-lg',
      'disabled:cursor-not-allowed disabled:opacity-80',
      shapes[this.shape()],
      accent
        ? cn(accents[accent].box, accents[accent].label)
        : this.selected()
          ? 'bg-accent-md text-dark-1'
          : 'bg-idle text-idle-fg',
    );
  });

  protected readonly textClass = computed(() =>
    cn('font-normal', this.compact() ? 'truncate text-[11px]' : 'text-[13px]'),
  );

  protected readonly dotTone = computed<IconTone | undefined>(() =>
    this.selected() || this.accent() ? undefined : 'faint',
  );
}

/** Contenedor de chips con el espaciado estándar. */
@Component({
  selector: 'app-chip-group',
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class ChipGroup {
  readonly center = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() =>
    cn('flex flex-wrap gap-x-3 gap-y-4', this.center() && 'justify-center'),
  );
}
