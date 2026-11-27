import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import type { AccentLevel } from '../../../theme';
import { Chip } from './chip';

const GAP = 8;

export interface ChipItem {
  label: string;
  accent?: AccentLevel;
}

/**
 * Chips (pill) en una sola línea; los que no entran se resumen en "+N".
 * Mide una copia invisible para saber cuántos caben.
 */
@Component({
  selector: 'app-chip-row',
  imports: [Chip],
  host: { class: 'relative flex gap-2 overflow-hidden' },
  template: `
    <div #measure aria-hidden="true" class="pointer-events-none invisible absolute flex gap-2">
      @for (chip of chips(); track $index) {
        <span app-chip shape="pill" [accent]="chip.accent">{{ chip.label }}</span>
      }
      <span app-chip shape="circle">+{{ chips().length }}</span>
    </div>
    @for (chip of chips().slice(0, visible()); track $index) {
      <span app-chip shape="pill" [accent]="chip.accent">{{ chip.label }}</span>
    }
    @if (hidden() > 0) {
      <span app-chip shape="circle" [attr.title]="hiddenLabels()">+{{ hidden() }}</span>
    }
  `,
})
export class ChipRow {
  readonly chips = input.required<readonly ChipItem[]>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly measure = viewChild.required<ElementRef<HTMLElement>>('measure');
  private readonly width = signal(0);
  private readonly widths = signal<number[]>([]);
  private readonly moreWidth = signal(0);

  protected readonly visible = computed(() => {
    const chips = this.chips().length;
    const widths = this.widths();
    const width = this.width();
    if (!width || widths.length !== chips) return chips;
    const total = (n: number) =>
      widths.slice(0, n).reduce((a, w) => a + w, 0) + GAP * Math.max(n - 1, 0);
    if (total(chips) <= width) return chips;
    let n = 0;
    while (n < chips && total(n + 1) + GAP + this.moreWidth() <= width) n++;
    return n;
  });
  protected readonly hidden = computed(() => this.chips().length - this.visible());
  protected readonly hiddenLabels = computed(() =>
    this.chips()
      .slice(this.visible())
      .map((c) => c.label)
      .join(', '),
  );

  constructor() {
    const observer = new ResizeObserver(() => this.read());
    afterNextRender(() => {
      observer.observe(this.host);
      observer.observe(this.measure().nativeElement);
    });
    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }

  private read() {
    const items = [...this.measure().nativeElement.children] as HTMLElement[];
    this.widths.set(items.slice(0, -1).map((el) => el.offsetWidth));
    this.moreWidth.set(items.at(-1)?.offsetWidth ?? 0);
    this.width.set(this.host.clientWidth);
  }
}
