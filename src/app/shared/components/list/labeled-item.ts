import { booleanAttribute, Component, computed, input } from '@angular/core';
import { accents, cn, type AccentLevel } from '../../theme';
import { Text } from '../base/text';

export type LabeledItemVariant = 'pill' | 'input';

const labelWidths = {
  narrow: 'w-[28%]',
  wide: 'w-[30%]',
  half: 'w-[45%]',
  form: 'w-[110px]',
  formWide: 'w-[140px]',
  fit: 'shrink-0 px-4',
} as const;
export type LabelWidth = keyof typeof labelWidths;

const cell = 'rounded-lg px-3 py-2 font-light';

/**
 * Etiqueta + valor en una fila. `pill`: dato de solo lectura (vacío muestra
 * "---"). `input`: aspecto de campo, lo usa FieldRow.
 */
@Component({
  selector: 'app-labeled-item',
  imports: [Text],
  host: { '[class]': 'hostClasses()' },
  template: `
    <span appText="itemSm" [class]="labelClasses()">{{ label() }}</span>
    <span appText="itemSm" [class]="contentClasses()">
      {{ content() || (variant() === 'input' ? '' : '---') }}
    </span>
  `,
})
export class LabeledItem {
  readonly label = input.required<string>();
  readonly content = input<string | null>();
  readonly accent = input<AccentLevel>();
  readonly muted = input(false, { transform: booleanAttribute });
  readonly variant = input<LabeledItemVariant>('pill');
  readonly expand = input(false, { transform: booleanAttribute });
  readonly labelWidth = input<LabelWidth>();

  private readonly empty = computed(() => !this.content());

  protected readonly hostClasses = computed(() => {
    const w = this.labelWidth();
    return cn(
      'flex items-center justify-between',
      w === 'narrow' || w === 'half' ? 'gap-6' : 'gap-2',
      this.expand() && 'flex-1',
    );
  });

  protected readonly labelClasses = computed(() => {
    const w = this.labelWidth();
    const accent = this.accent();
    return cn(
      cell,
      this.empty() || this.muted() ? 'bg-tag text-tag-fg' : 'bg-tag-filled text-tag-filled-fg',
      w && labelWidths[w],
      accent && cn(accents[accent].box, accents[accent].label),
    );
  });

  protected readonly contentClasses = computed(() => {
    const input = this.variant() === 'input';
    const empty = this.empty();
    return cn(
      cell,
      'min-h-9 flex-1 truncate text-left',
      input && 'px-4',
      // `bg-value` es claro en los tres tonos, por eso el texto va fijo en dark-1.
      input && !empty ? 'bg-value text-dark-1' : 'bg-inset',
      empty && !input && 'text-faint',
    );
  });
}
