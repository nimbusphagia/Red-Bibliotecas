import { booleanAttribute, Component, computed, Directive, inject, input } from '@angular/core';
import { LucideDot } from '@lucide/angular';
import { cn } from '../../theme';
import { Icon } from '../base/icon';
import { IN_SECTION } from '../base/surface';
import { Text } from '../base/text';

/**
 * Fila de ItemList sobre cualquier elemento: `<li appListRow>`, `<a appListRow>`.
 * Con `inset` (por defecto) lleva el fondo `bg-row`; no cambia el tono.
 */
@Directive({
  selector: '[appListRow]',
  host: { '[class]': 'classes()' },
})
export class ListRow {
  readonly compact = input(false, { transform: booleanAttribute });
  readonly inset = input(true, { transform: booleanAttribute });

  private readonly inSection = inject(IN_SECTION);

  protected readonly classes = computed(() =>
    cn(
      'flex items-center justify-between gap-6',
      this.inSection ? 'px-3' : 'px-4',
      this.compact() ? 'py-1.5' : 'py-3',
      this.inset() && 'bg-row rounded-lg',
    ),
  );
}

const columnWidths = {
  sm: 'w-12',
  md: 'w-28',
  lg: 'w-48',
} as const;
export type ColumnWidth = keyof typeof columnWidths;

const columnVariants = {
  id: { container: 'min-w-[30px] justify-start items-center', text: 'text-center' },
  subtitled: { container: 'flex-col justify-center items-start', text: '' },
  actions: { container: 'justify-center gap-4', text: '' },
} as const;
export type ColumnVariant = keyof typeof columnVariants;

/**
 * Celda de una ListRow. Sin `width` ocupa el espacio libre (`expand`).
 * `subtitled`: texto con una línea de subtítulos debajo.
 * `actions`: botones (como contenido), alineados al final si tiene `width`.
 */
@Component({
  selector: 'app-column',
  imports: [Icon, Text],
  host: { '[class]': 'classes()' },
  template: `
    @if (text()) {
      <span appText="itemSm" [class]="textClasses()">{{ text() }}</span>
    }
    <ng-content />
    @if (variant() === 'subtitled' && (subtitle1() || subtitle2())) {
      <span class="flex max-w-full items-center">
        <span appText="caption" class="shrink truncate">{{ subtitle1() }}</span>
        @if (subtitle1() && subtitle2()) {
          <app-icon [icon]="dot" tone="faint" />
        }
        <span appText="caption" class="shrink truncate">{{ subtitle2() }}</span>
      </span>
    }
  `,
})
export class Column {
  readonly text = input<string | null>();
  readonly width = input<ColumnWidth>();
  readonly variant = input<ColumnVariant>();
  readonly subtitle1 = input<string | null>();
  readonly subtitle2 = input<string | null>();
  readonly expand = input(true, { transform: booleanAttribute });

  protected readonly dot = LucideDot;

  protected readonly classes = computed(() => {
    const width = this.width();
    const variant = this.variant();
    return cn(
      'flex min-w-0 items-center',
      this.expand() && !width && variant !== 'id' && 'flex-1',
      variant && columnVariants[variant].container,
      width && cn('shrink-0', columnWidths[width]),
      width && variant === 'actions' && 'justify-end',
    );
  });

  protected readonly textClasses = computed(() => {
    const variant = this.variant();
    return cn('max-w-full truncate', variant && columnVariants[variant].text);
  });
}
