import { computed, Directive, input } from '@angular/core';

export type TextVariant =
  'display' | 'title' | 'section' | 'item' | 'itemSm' | 'itemXs' | 'caption' | 'captionXs';

// Solo tamaño y peso. El color sale de la superficie (text-fg / text-muted).
const sizes: Record<TextVariant, string> = {
  display: 'text-[26px] font-semibold',
  title: 'text-[22px] font-medium',
  section: 'text-[17px] font-normal',
  item: 'text-[15px] font-normal',
  itemSm: 'text-[13px] font-light',
  itemXs: 'text-[12px] font-light',
  caption: 'text-[13px] font-light text-muted',
  captionXs: 'text-[12px] font-light text-muted',
};

/** Tipografía sobre cualquier elemento: `<h1 appText="title">`. */
@Directive({
  selector: '[appText]',
  host: { '[class]': 'classes()' },
})
export class Text {
  readonly variant = input<TextVariant | ''>('', { alias: 'appText' });

  protected readonly classes = computed(() => {
    const v = this.variant();
    return v ? sizes[v] : '';
  });
}
