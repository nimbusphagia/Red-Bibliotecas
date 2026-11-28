import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  contentChild,
  inject,
  input,
  linkedSignal,
  resource,
} from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { LucideChevronDown, LucideLoaderCircle } from '@lucide/angular';
import { cn } from '../../theme';
import { Icon } from '../base/icon';
import { Accordion, type GroupId } from './accordion';
import { ItemTemplate } from './item-template';

/**
 * Grupo plegable: el encabezado (contenido con el atributo `header`) y, al
 * abrirlo, sus filas sobre un fondo inset. Las filas se cargan al abrir.
 * Dentro de ItemList (o de otro proveedor de Accordion), abrir un grupo
 * cierra el que estaba abierto.
 */
@Component({
  selector: 'app-collapsible-list',
  imports: [Icon, NgTemplateOutlet],
  // Fondo inset: no cambia el tono, así que basta la clase (no hace falta Surface).
  host: { class: 'flex flex-col gap-3 overflow-hidden rounded-2xl bg-inset p-3' },
  template: `
    <button
      type="button"
      class="flex cursor-pointer items-center gap-4 rounded-lg p-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-lg"
      [attr.aria-expanded]="open()"
      [attr.aria-controls]="panelId"
      (click)="toggle()"
    >
      <span class="min-w-0 flex-1"><ng-content select="[header]" /></span>
      <span [class]="chevronClasses()">
        <app-icon [icon]="chevron" tone="text-dark-solid" />
      </span>
    </button>
    <div [id]="panelId" class="flex flex-col gap-3 empty:hidden">
      @if (open()) {
        @if (rows.hasValue()) {
          @for (item of rows.value(); track item.id) {
            <div class="animate-fade-in">
              <ng-container
                *ngTemplateOutlet="itemTemplate().template; context: { $implicit: item }"
              />
            </div>
          }
        } @else if (rows.error()) {
          <p class="pt-1 text-center text-[13px] font-light text-muted">No se pudo cargar</p>
        } @else {
          <div class="flex justify-center" role="status" aria-label="Cargando">
            <app-icon [icon]="loader" size="xl" class="animate-spin" />
          </div>
        }
      }
    </div>
  `,
})
export class CollapsibleList<T extends { id: string | number }> {
  /** Identifica el grupo dentro de un Accordion. */
  readonly groupId = input<GroupId>();
  readonly load = input.required<() => Promise<readonly T[]>>();
  /** Cambia cuando las filas abiertas deben volver a cargarse. */
  readonly reloadKey = input<unknown>();
  /** Si cambia, abre o cierra el grupo (p. ej. todos abiertos al buscar). */
  readonly defaultOpen = input(false, { transform: booleanAttribute });

  protected readonly itemTemplate = contentChild.required<ItemTemplate<T>>(ItemTemplate);
  protected readonly chevron = LucideChevronDown;
  protected readonly loader = LucideLoaderCircle;
  protected readonly panelId = inject(_IdGenerator).getId('app-collapsible-');

  private readonly accordion = inject(Accordion, { optional: true });

  /** El grupo abierto del Accordion, si este grupo participa. */
  private readonly accordionOpen = computed(() => {
    const id = this.groupId();
    return this.accordion && id !== undefined ? this.accordion.openId() === id : false;
  });

  // Se recalcula cuando cambia defaultOpen o se abre otro grupo; toggle lo pisa.
  protected readonly open = linkedSignal(() => this.defaultOpen() || this.accordionOpen());

  protected readonly rows = resource({
    params: () => (this.open() ? { key: this.reloadKey() } : undefined),
    loader: () => this.load()(),
  });

  protected readonly chevronClasses = computed(() =>
    cn(
      'flex size-6 items-center justify-center rounded-full bg-bg/25 transition-transform duration-200',
      this.open() && 'rotate-180',
    ),
  );

  protected toggle() {
    const id = this.groupId();
    const opening = !this.open();
    if (this.accordion && id !== undefined) {
      if (opening) this.accordion.openId.set(id);
      else if (this.accordion.openId() === id) this.accordion.openId.set(undefined);
    }
    this.open.set(opening);
  }
}
