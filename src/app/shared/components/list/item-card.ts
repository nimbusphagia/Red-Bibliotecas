import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowUpRight } from '@lucide/angular';
import { cn } from '../../theme';
import { Icon } from '../base/icon';
import { Text } from '../base/text';
import { Chip } from '../form/select/chip';
import { ChipRow, type ChipItem } from '../form/select/chip-row';

/**
 * Tarjeta enlazada de una lista en columnas: `<a app-item-card link="/libros/4" title="…">`.
 * Con `lead`, una línea de texto y los chips a la derecha; si no, los chips
 * en una fila que resume los que no entran.
 */
@Component({
  selector: 'a[app-item-card]',
  imports: [Chip, ChipRow, Icon, Text],
  hostDirectives: [{ directive: RouterLink, inputs: ['routerLink: link'] }],
  host: {
    class:
      'flex grow flex-col justify-between gap-4 rounded-2xl bg-card p-4 transition hover:brightness-97 active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-lg',
  },
  template: `
    <span class="flex items-start gap-2">
      <span class="flex min-w-0 flex-1 flex-col gap-1">
        <span appText="item" class="line-clamp-2">{{ title() }}</span>
        @if (subtitle()) {
          <span appText="caption" class="truncate">{{ subtitle() }}</span>
        }
        @if (detail()) {
          <span appText="captionXs" [class]="detailClasses()">{{ detail() }}</span>
        }
        @if (note()) {
          <span appText="captionXs" class="truncate">{{ note() }}</span>
        }
      </span>
      <app-icon [icon]="arrow" size="lg" class="text-soft-fg" aria-hidden="true" />
    </span>
    @if (lead()) {
      <span class="flex items-center gap-2">
        <span appText="itemSm" class="min-w-0 flex-1 truncate">{{ lead() }}</span>
        @for (chip of chips(); track $index) {
          <span app-chip shape="pill" [accent]="chip.accent">{{ chip.label }}</span>
        }
      </span>
    } @else if (chips().length) {
      <app-chip-row [chips]="chips()" />
    }
  `,
})
export class ItemCard {
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>();
  readonly detail = input<string | null>();
  readonly detailClass = input<string>();
  /** Línea extra bajo `detail`. */
  readonly note = input<string | null>();
  readonly chips = input<readonly ChipItem[]>([]);
  readonly lead = input<string | null>();

  protected readonly arrow = LucideArrowUpRight;
  protected readonly detailClasses = computed(() => cn('truncate', this.detailClass()));
}
