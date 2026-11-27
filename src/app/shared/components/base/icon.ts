import { Component, computed, input } from '@angular/core';
import { LucideDynamicIcon, type LucideIconInput } from '@lucide/angular';

const sizes = { sm: 12, md: 14, lg: 16, xl: 20 } as const;
const strokes = { sm: 1.5, md: 2.5, lg: 3, xl: 3 } as const;

export type IconSize = keyof typeof sizes;
export type IconStroke = keyof typeof strokes;
/**
 * Clase de color (`text-accent-neg`, `text-accent-lg`...) o "faint" (detalles
 * tenues). Sin tono, el ícono toma el color del texto que lo rodea.
 */
export type IconTone = 'faint' | `text-${string}`;

@Component({
  selector: 'app-icon',
  imports: [LucideDynamicIcon],
  host: {
    class: 'inline-flex shrink-0',
    '[class]': 'toneClass()',
  },
  template: `<svg [lucideIcon]="icon()" [size]="px()" [strokeWidth]="strokeWidth()"></svg>`,
})
export class Icon {
  readonly icon = input.required<LucideIconInput>();
  readonly size = input<IconSize>('md');
  readonly tone = input<IconTone>();
  readonly stroke = input<IconStroke>('md');

  protected readonly px = computed(() => sizes[this.size()]);
  protected readonly strokeWidth = computed(() => strokes[this.stroke()]);
  protected readonly toneClass = computed(() => {
    const tone = this.tone();
    return tone === 'faint' ? 'text-faint' : (tone ?? '');
  });
}
