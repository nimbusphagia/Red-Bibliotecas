import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, type TemplateRef } from '@angular/core';
import { cn, type Tone } from '../../theme';
import { injectLayoutMode } from '../base/content-area';
import { Panel } from '../base/surface';
import { DetailRows, type DetailRow } from './detail-rows';
import type { LabeledItemVariant } from './labeled-item';

export interface DetailColumn {
  title: string;
  rows: readonly DetailRow[];
  /** Acción del encabezado (p. ej. un botón Editar). */
  lead?: TemplateRef<unknown>;
  tone?: Tone;
  variant?: LabeledItemVariant;
  columns?: 1 | 2;
  /** Ancho fijo (w-60) en expandido, en lugar de repartir el espacio. */
  fit?: boolean;
  fixed?: boolean;
}

/** Paneles de DetailRows: lado a lado en expandido, apilados en compacto. */
@Component({
  selector: 'app-detail-columns',
  imports: [DetailRows, NgTemplateOutlet, Panel],
  host: { '[class]': 'hostClasses()' },
  template: `
    @for (c of columns(); track c.title) {
      <app-panel [title]="c.title" [tone]="c.tone" [class]="panelClasses(c)">
        @if (c.lead; as lead) {
          <ng-container ngProjectAs="[lead]">
            <ng-container *ngTemplateOutlet="lead" />
          </ng-container>
        }
        <app-detail-rows
          [rows]="c.rows"
          [variant]="c.variant ?? 'pill'"
          [columns]="c.columns ?? 1"
          [fixed]="!!c.fixed"
        />
      </app-panel>
    }
  `,
})
export class DetailColumns {
  readonly columns = input.required<readonly DetailColumn[]>();

  private readonly layout = injectLayoutMode();

  protected readonly hostClasses = computed(() =>
    cn('flex flex-col gap-4', this.layout.isExpanded() && 'flex-row items-start'),
  );

  protected panelClasses(c: DetailColumn) {
    return this.layout.isExpanded() ? (c.fit ? 'w-60 shrink-0' : 'min-w-0 flex-1') : '';
  }
}
