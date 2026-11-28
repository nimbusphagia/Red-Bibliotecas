import { computed, effect, signal, untracked, type Signal } from '@angular/core';

/** Tamaño de página de las listas. */
export const PAGE_SIZE = 20;

/** Una página de resultados y el total sin paginar. */
export interface Page<T> {
  items: T[];
  total: number;
}

export interface InfiniteList<T> {
  readonly items: Signal<readonly T[]>;
  readonly total: Signal<number>;
  readonly loading: Signal<boolean>;
  readonly error: Signal<unknown>;
  /** Pide la página siguiente, si hay y no se está cargando otra. */
  loadMore(): void;
  /** Vuelve a cargar desde la primera página. */
  reload(): void;
}

/**
 * Lista paginada para ItemList. Cuando cambia `params` empieza de nuevo
 * desde la primera página; las respuestas de pedidos viejos se descartan.
 * Requiere contexto de inyección.
 *
 * ```ts
 * readonly list = infiniteList({
 *   params: () => ({ search: this.query() }),
 *   loader: (params, offset) => this.books.list({ ...params, offset }),
 * });
 * ```
 */
export function infiniteList<T, P>(options: {
  params: () => P;
  loader: (params: P, offset: number) => Promise<Page<T>>;
}): InfiniteList<T> {
  const params = computed(options.params);
  const items = signal<readonly T[]>([]);
  const total = signal(0);
  const loading = signal(true);
  const error = signal<unknown>(null);
  let generation = 0;

  const load = async (offset: number) => {
    const mine = generation;
    loading.set(true);
    try {
      const page = await options.loader(params(), offset);
      if (mine !== generation) return;
      items.update((prev) => (offset === 0 ? page.items : [...prev, ...page.items]));
      total.set(page.total);
      error.set(null);
    } catch (e) {
      if (mine === generation) error.set(e);
    } finally {
      if (mine === generation) loading.set(false);
    }
  };

  const restart = () => {
    generation++;
    void load(0);
  };

  effect(() => {
    params();
    untracked(() => {
      items.set([]);
      total.set(0);
      error.set(null);
      restart();
    });
  });

  return {
    items: items.asReadonly(),
    total: total.asReadonly(),
    loading: loading.asReadonly(),
    error: error.asReadonly(),
    loadMore() {
      if (loading() || error() != null || items().length >= total()) return;
      void load(items().length);
    },
    reload: restart,
  };
}
