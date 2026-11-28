import type { BookListItem } from './book';

// Datos de prueba hasta conectar SpringLMS. Solo los usa BookService.

interface Named {
  id: number;
  name: string;
}

export const AUTHORS = [
  { id: 1, firstName: 'Gabriel', lastName: 'García Márquez' },
  { id: 2, firstName: 'Isabel', lastName: 'Allende' },
  { id: 3, firstName: 'Julio', lastName: 'Cortázar' },
  { id: 4, firstName: 'Jorge Luis', lastName: 'Borges' },
  { id: 5, firstName: 'J. K.', lastName: 'Rowling' },
  { id: 6, firstName: 'Quino', lastName: null },
  { id: 7, firstName: 'Elsa', lastName: 'Bornemann' },
  { id: 8, firstName: 'María Elena', lastName: 'Walsh' },
  { id: 9, firstName: 'Roberto', lastName: 'Bolaño' },
  { id: 10, firstName: 'Gabriela', lastName: 'Mistral' },
  { id: 11, firstName: 'Antoine', lastName: 'de Saint-Exupéry' },
  { id: 12, firstName: 'Michael', lastName: 'Ende' },
  { id: 13, firstName: 'Pablo', lastName: 'Neruda' },
  { id: 14, firstName: 'Mario', lastName: 'Vargas Llosa' },
];

export const PUBLISHERS: Named[] = [
  { id: 1, name: 'Sudamericana' },
  { id: 2, name: 'Alfaguara' },
  { id: 3, name: 'Salamandra' },
  { id: 4, name: 'Planeta' },
  { id: 5, name: 'Ediciones de la Flor' },
  { id: 6, name: 'Anagrama' },
  { id: 7, name: 'Zig-Zag' },
];

export const COLLECTIONS: (Named & { publisherId: number })[] = [
  { id: 1, name: 'Alfaguara Infantil', publisherId: 2 },
  { id: 2, name: 'Alfaguara Juvenil', publisherId: 2 },
  { id: 3, name: 'Compactos', publisherId: 6 },
  { id: 4, name: 'Biblioteca Escolar', publisherId: 7 },
];

export const SERIES: (Named & { authorId: number })[] = [
  { id: 1, name: 'Harry Potter', authorId: 5 },
  { id: 2, name: 'Mafalda', authorId: 6 },
];

export const CATEGORIES: Named[] = [
  { id: 1, name: 'Narrativa' },
  { id: 2, name: 'Poesía' },
  { id: 3, name: 'Infantil' },
  { id: 4, name: 'Juvenil' },
  { id: 5, name: 'Historieta' },
];

export const SUBCATEGORIES: Named[] = [
  { id: 1, name: 'Novela' },
  { id: 2, name: 'Cuento' },
  { id: 3, name: 'Fantasía' },
  { id: 4, name: 'Clásicos' },
  { id: 5, name: 'Humor' },
];

type Row = [
  title: string,
  authors: number[],
  publisher: number,
  collection: number | null,
  series: number | null,
  category: number,
  subcategory: number | null,
  active: number,
  damaged?: number,
  outdated?: number,
];

const ROWS: Row[] = [
  ['Cien años de soledad', [1], 1, null, null, 1, 1, 4],
  ['El amor en los tiempos del cólera', [1], 1, null, null, 1, 1, 2, 0, 1],
  ['Crónica de una muerte anunciada', [1], 1, null, null, 1, 1, 3],
  ['La casa de los espíritus', [2], 4, null, null, 1, 1, 3, 1],
  ['Eva Luna', [2], 4, null, null, 1, 1, 2],
  ['Paula', [2], 4, null, null, 1, null, 1],
  ['Rayuela', [3], 2, null, null, 1, 1, 2],
  ['Bestiario', [3], 2, null, null, 1, 2, 1],
  ['Historias de cronopios y de famas', [3], 2, null, null, 1, 2, 2, 0, 2],
  ['Ficciones', [4], 2, null, null, 1, 2, 3],
  ['El Aleph', [4], 2, null, null, 1, 2, 2],
  ['Harry Potter y la piedra filosofal', [5], 3, null, 1, 4, 3, 5, 1],
  ['Harry Potter y la cámara secreta', [5], 3, null, 1, 4, 3, 4, 0, 1],
  ['Harry Potter y el prisionero de Azkaban', [5], 3, null, 1, 4, 3, 3],
  ['Harry Potter y el cáliz de fuego', [5], 3, null, 1, 4, 3, 2],
  ['Mafalda 1', [6], 5, null, 2, 5, 5, 3],
  ['Mafalda 2', [6], 5, null, 2, 5, 5, 2],
  ['Toda Mafalda', [6], 5, null, 2, 5, 5, 1, 1],
  ['Un elefante ocupa mucho espacio', [7], 2, 1, null, 3, 2, 4],
  ['¡Socorro!', [7], 2, 1, null, 3, 2, 2, 0, 1],
  ['Manuelita ¿dónde vas?', [8], 2, 1, null, 3, null, 3],
  ['El reino del revés', [8], 2, 1, null, 3, null, 2],
  ['Los detectives salvajes', [9], 6, 3, null, 1, 1, 2],
  ['2666', [9], 6, 3, null, 1, 1, 1],
  ['Desolación', [10], 7, 4, null, 2, null, 1],
  ['El principito', [11], 7, 4, null, 3, 4, 6, 2, 1],
  ['La historia interminable', [12], 2, 2, null, 4, 3, 3],
  ['Momo', [12], 2, 2, null, 4, 3, 2],
  ['Veinte poemas de amor y una canción desesperada', [13], 4, null, null, 2, 4, 3],
  ['La ciudad y los perros', [14], 2, null, null, 1, 1, 2],
  ['Conversación en La Catedral', [14], 2, null, null, 1, 1, 1],
];

const nameOf = (list: Named[], id: number | null) => list.find((x) => x.id === id)?.name ?? null;

export const BOOKS: BookListItem[] = ROWS.map(
  (
    [title, authors, publisherId, collectionId, seriesId, categoryId, subcategoryId, ...counts],
    i,
  ) => {
    const [activeCount, damagedCount = 0, outdatedCount = 0] = counts;
    return {
      id: i + 1,
      title,
      collaborators: authors.map((id) => {
        const a = AUTHORS.find((x) => x.id === id)!;
        return { authorId: id, role: 'writer', firstName: a.firstName, lastName: a.lastName };
      }),
      publisherId,
      publisherName: nameOf(PUBLISHERS, publisherId),
      collectionId,
      collectionName: nameOf(COLLECTIONS, collectionId),
      seriesId,
      seriesName: nameOf(SERIES, seriesId),
      categoryId,
      categoryName: nameOf(CATEGORIES, categoryId),
      subcategoryId,
      subcategoryName: nameOf(SUBCATEGORIES, subcategoryId),
      activeCount,
      damagedCount,
      outdatedCount,
    };
  },
);
