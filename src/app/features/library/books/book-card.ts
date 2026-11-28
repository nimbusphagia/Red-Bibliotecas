import { Component, computed, input } from '@angular/core';
import { ItemCard, type ChipItem } from '../../../shared/components';
import type { AccentLevel } from '../../../shared/theme';
import { formatContributors, type BookListItem } from './book';

const chip = (label: string | false | null, accent?: AccentLevel): ChipItem[] =>
  label ? [{ label, accent }] : [];

@Component({
  selector: 'app-book-card',
  imports: [ItemCard],
  host: { class: 'flex grow flex-col' },
  template: `
    <a
      app-item-card
      class="py-6"
      [link]="'/libros/' + book().id"
      [title]="book().title"
      [subtitle]="contributors()"
      [detail]="book().publisherName"
      [note]="note()"
      [chips]="chips()"
    ></a>
  `,
})
export class BookCard {
  readonly book = input.required<BookListItem>();

  protected readonly contributors = computed(() => formatContributors(this.book().collaborators));

  protected readonly note = computed(() => {
    const n = this.book().activeCount;
    return `${n} ${n === 1 ? 'ejemplar' : 'ejemplares'}`;
  });

  protected readonly chips = computed(() => {
    const b = this.book();
    return [
      ...chip(b.damagedCount > 0 && 'Ejemplares deteriorados', 'neg'),
      ...chip(b.outdatedCount > 0 && 'Tejuelos desactualizados', 'neg'),
      ...chip(b.seriesName && `"${b.seriesName}"`, 'md'),
      ...chip(b.collectionName, 'sm'),
      ...chip(b.categoryName),
      ...chip(b.subcategoryName),
    ];
  });
}
