import { Injectable, signal } from '@angular/core';

export type GroupId = string | number;

/** Grupos de CollapsibleList bajo un mismo proveedor: abrir uno cierra el anterior. */
@Injectable()
export class Accordion {
  readonly openId = signal<GroupId | undefined>(undefined);
}
