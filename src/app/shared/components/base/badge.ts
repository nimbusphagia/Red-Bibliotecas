import { Component, computed, input } from '@angular/core';
import type { LucideIconInput } from '@lucide/angular';
import { accents, cn, type AccentLevel } from '../../theme';
import { Icon, type IconTone } from './icon';

/** Ícono de estado: con `accent` va en un círculo del acento; sin él, solo el ícono (mismo tamaño). */
@Component({
  selector: 'app-status-icon',
  imports: [Icon],
  host: {
    class: 'inline-flex size-8 shrink-0 items-center justify-center rounded-full',
    '[class]': 'accentClass()',
  },
  template: `<app-icon [icon]="icon()" size="lg" stroke="sm" [tone]="tone()" />`,
})
export class StatusIcon {
  readonly icon = input.required<LucideIconInput>();
  readonly accent = input<AccentLevel>();
  readonly tone = input<IconTone>();

  protected readonly accentClass = computed(() => {
    const a = this.accent();
    return a ? cn(accents[a].box, accents[a].label) : '';
  });
}

/** Ícono + texto en una píldora del acento; sin `accent`, como un chip sin seleccionar. */
@Component({
  selector: 'app-status-chip',
  imports: [Icon],
  host: {
    class: 'inline-flex h-8 items-center gap-2 rounded-full px-3 text-[13px] font-light',
    '[class]': 'chipClass()',
  },
  template: `
    <app-icon [icon]="icon()" size="lg" stroke="sm" />
    <span>{{ text() }}</span>
  `,
})
export class StatusChip {
  readonly text = input.required<string>();
  readonly icon = input.required<LucideIconInput>();
  readonly accent = input<AccentLevel>();

  protected readonly chipClass = computed(() => {
    const a = this.accent();
    return a ? cn(accents[a].box, accents[a].label) : 'bg-idle text-idle-fg';
  });
}

@Component({
  selector: 'app-status-indicator',
  imports: [StatusIcon],
  host: { class: 'inline-flex items-center gap-2 text-[15px] font-normal' },
  template: `
    @if (icon(); as icon) {
      <app-status-icon [icon]="icon" [accent]="accent()" />
    }
    <span>{{ text() }}</span>
  `,
})
export class StatusIndicator {
  readonly text = input.required<string>();
  readonly icon = input<LucideIconInput>();
  readonly accent = input<AccentLevel>();
}
