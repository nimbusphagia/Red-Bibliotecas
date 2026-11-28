import type { SortDirection } from '../../../shared/components';

export type BookSort = 'title' | 'author' | 'publisher';

export type CollaboratorRole = 'writer' | 'illustrator' | 'translator';

export interface BookCollaborator {
  authorId: number;
  role: CollaboratorRole;
  firstName: string;
  lastName: string | null;
}

/** Un libro tal como lo muestra la lista del catálogo. */
export interface BookListItem {
  id: number;
  title: string;
  collaborators: BookCollaborator[];
  publisherId: number | null;
  publisherName: string | null;
  collectionId: number | null;
  collectionName: string | null;
  seriesId: number | null;
  seriesName: string | null;
  categoryId: number | null;
  categoryName: string | null;
  subcategoryId: number | null;
  subcategoryName: string | null;
  /** Ejemplares que no se dieron de baja. */
  activeCount: number;
  damagedCount: number;
  /** Ejemplares con el tejuelo desactualizado. */
  outdatedCount: number;
}

export interface BookListParams {
  search?: string;
  authorId?: number;
  publisherId?: number;
  collectionId?: number;
  seriesId?: number;
  categoryId?: number;
  subcategoryId?: number;
  sortBy: BookSort;
  sortDir: SortDirection;
  limit: number;
  offset: number;
}

export const fullName = (p: { firstName: string; lastName: string | null }) =>
  [p.firstName, p.lastName].filter(Boolean).join(' ');

/** Autores del libro, sin repetir, separados por coma. */
export const formatContributors = (list: readonly BookCollaborator[]) =>
  [...new Set(list.map(fullName))].join(', ');
