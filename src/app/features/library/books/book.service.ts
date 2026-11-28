import { Injectable } from '@angular/core';
import type { Option } from '../../../shared/components';
import type { Page } from '../../../shared/utils/infinite-list';
import { fullName, type BookListItem, type BookListParams } from './book';
import {
  AUTHORS,
  BOOKS,
  CATEGORIES,
  COLLECTIONS,
  PUBLISHERS,
  SERIES,
  SUBCATEGORIES,
} from './fake-books';

/** Para buscar sin importar mayúsculas, tildes ni espacios de más. */
const searchKey = (s: string) =>
  s
    .trim()
    .replace(/\s+/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const matches = (search: string | undefined, ...texts: (string | null)[]) => {
  const key = searchKey(search ?? '');
  return !key || texts.some((t) => t !== null && searchKey(t).includes(key));
};

/** Orden alfabético en español, sin contar signos ("¡Socorro!" va en la S). */
const compare = (a: string, b: string) => a.localeCompare(b, 'es', { ignorePunctuation: true });

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const OPTIONS_LIMIT = 20;

const sortKey: Record<BookListParams['sortBy'], (b: BookListItem) => string> = {
  title: (b) => b.title,
  author: (b) => b.collaborators[0]?.lastName ?? b.collaborators[0]?.firstName ?? '',
  publisher: (b) => b.publisherName ?? '',
};

/**
 * Catálogo de libros. Por ahora responde con datos de prueba y un retardo
 * simulado; cuando exista el cliente HTTP, cada método pasa a ser un GET a
 * SpringLMS con la misma firma.
 */
@Injectable({ providedIn: 'root' })
export class BookService {
  async list(params: BookListParams): Promise<Page<BookListItem>> {
    await delay(300);
    const sign = params.sortDir === 'asc' ? 1 : -1;
    const key = sortKey[params.sortBy];
    const found = BOOKS.filter(
      (b) =>
        matches(params.search, b.title, b.publisherName, ...b.collaborators.map(fullName)) &&
        (params.authorId === undefined ||
          b.collaborators.some((c) => c.authorId === params.authorId)) &&
        (params.publisherId === undefined || b.publisherId === params.publisherId) &&
        (params.collectionId === undefined || b.collectionId === params.collectionId) &&
        (params.seriesId === undefined || b.seriesId === params.seriesId) &&
        (params.categoryId === undefined || b.categoryId === params.categoryId) &&
        (params.subcategoryId === undefined || b.subcategoryId === params.subcategoryId),
    ).sort((a, b) => sign * compare(key(a), key(b)) || compare(a.title, b.title));
    return {
      items: found.slice(params.offset, params.offset + params.limit),
      total: found.length,
    };
  }

  async searchAuthors(search: string): Promise<Option[]> {
    await delay(150);
    return AUTHORS.filter((a) => matches(search, fullName(a)))
      .slice(0, OPTIONS_LIMIT)
      .map((a) => ({ id: a.id, label: fullName(a) }));
  }

  async searchPublishers(search: string): Promise<Option[]> {
    await delay(150);
    return PUBLISHERS.filter((p) => matches(search, p.name))
      .slice(0, OPTIONS_LIMIT)
      .map((p) => ({ id: p.id, label: p.name }));
  }

  /** Series de un autor. */
  async searchSeries(search: string, authorId: number): Promise<Option[]> {
    await delay(150);
    return SERIES.filter((s) => s.authorId === authorId && matches(search, s.name))
      .slice(0, OPTIONS_LIMIT)
      .map((s) => ({ id: s.id, label: s.name }));
  }

  /** Colecciones de una editorial. */
  async collections(publisherId: number): Promise<Option[]> {
    await delay(150);
    return COLLECTIONS.filter((c) => c.publisherId === publisherId).map((c) => ({
      id: c.id,
      label: c.name,
    }));
  }

  async categories(): Promise<Option[]> {
    await delay(150);
    return CATEGORIES.map((c) => ({ id: c.id, label: c.name }));
  }

  async subcategories(): Promise<Option[]> {
    await delay(150);
    return SUBCATEGORIES.map((s) => ({ id: s.id, label: s.name }));
  }
}
