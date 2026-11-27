import { effect, type Signal, signal, untracked } from '@angular/core';

/** Copia de `source` que se actualiza `ms` después del último cambio. Requiere contexto de inyección. */
export function debounced<T>(source: Signal<T>, ms = 250): Signal<T> {
  const out = signal(untracked(source));
  effect((onCleanup) => {
    const value = source();
    const timer = setTimeout(() => out.set(value), ms);
    onCleanup(() => clearTimeout(timer));
  });
  return out.asReadonly();
}
