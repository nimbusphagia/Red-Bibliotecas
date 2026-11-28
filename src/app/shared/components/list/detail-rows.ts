import { booleanAttribute, Component, computed, input } from '@angular/core';
import type { AccentLevel } from '../../theme';
import { injectLayoutMode } from '../base/content-area';
import { LabeledItem, type LabeledItemVariant, type LabelWidth } from './labeled-item';

export interface DetailRow {
  label: string;
  content?: string | null;
  accent?: AccentLevel;
  muted?: boolean;
}

/**
 * Datos de un registro como etiqueta + valor, en una o dos columnas.
 * En compacto (sin `fixed`) va en una columna y oculta los vacíos.
 */
@Component({
  selector: 'app-detail-rows',
  imports: [LabeledItem],
  host: { class: 'flex items-start gap-6' },
  template: `
    @for (group of groups(); track $index) {
      <div class="flex min-w-0 flex-1 flex-col gap-2.5">
        @for (r of group; track $index) {
          <app-labeled-item
            [label]="r.label"
            [content]="r.content"
            [accent]="r.accent"
            [muted]="!!r.muted"
            [variant]="variant()"
            [labelWidth]="labelWidth()"
          />
        }
      </div>
    }
  `,
})
export class DetailRows {
  readonly rows = input.required<readonly DetailRow[]>();
  readonly variant = input<LabeledItemVariant>('pill');
  readonly columns = input<1 | 2>(1);
  /** También en compacto: mismas columnas y sin ocultar los vacíos. */
  readonly fixed = input(false, { transform: booleanAttribute });

  private readonly layout = injectLayoutMode();
  private readonly full = computed(() => this.layout.isExpanded() || this.fixed());
  private readonly count = computed(() => (this.full() ? this.columns() : 1));

  protected readonly groups = computed(() => {
    const visible = this.full() ? this.rows() : this.rows().filter((r) => r.content && !r.muted);
    const n = this.count();
    const size = Math.ceil(visible.length / n);
    return Array.from({ length: n }, (_, i) => visible.slice(i * size, (i + 1) * size));
  });

  protected readonly labelWidth = computed<LabelWidth>(() =>
    this.variant() === 'pill' && this.count() === 1
      ? 'wide'
      : this.layout.isExpanded()
        ? 'narrow'
        : 'half',
  );
}
