import { Directive, inject, input, TemplateRef } from '@angular/core';

export interface ItemContext<T> {
  $implicit: T;
}

/**
 * Plantilla de cada elemento de ItemList o CollapsibleList:
 * `<ng-template appItem [appItemOf]="books" let-book>`.
 * `appItemOf` solo tipa `let-...`: acepta la lista o la función `load`.
 */
@Directive({ selector: 'ng-template[appItem]' })
export class ItemTemplate<T> {
  readonly appItemOf = input<readonly T[] | (() => Promise<readonly T[]>)>();
  readonly template = inject<TemplateRef<ItemContext<T>>>(TemplateRef);

  // Firma fija de Angular para tipar el contexto; los parámetros no se usan.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static ngTemplateContextGuard<T>(_dir: ItemTemplate<T>, ctx: unknown): ctx is ItemContext<T> {
    return true;
  }
}
