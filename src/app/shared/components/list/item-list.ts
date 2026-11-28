import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
  contentChild,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { LucideLoaderCircle } from '@lucide/angular';
import { cn, type Tone } from '../../theme';
import { injectLayoutMode } from '../base/content-area';
import { Icon } from '../base/icon';
import { IN_SECTION, Surface } from '../base/surface';
import { Text } from '../base/text';
import { Accordion } from './accordion';
import { ItemTemplate } from './item-template';

// Clases completas para que Tailwind las encuentre.
const gridCols: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

/**
 * Lista con toolbar opcional (elementos con el atributo `toolbar`) y
 * plantilla por elemento (`ng-template appItem`):
 *
 * ```html
 * <app-item-list [items]="books()" [loading]="loading()" (endReached)="more()">
 *   <app-inline-sort toolbar [options]="sorts" [(sort)]="sort" />
 *   <ng-template appItem [appItemOf]="books()" let-book>
 *     <div appListRow>…</div>
 *   </ng-template>
 * </app-item-list>
 * ```
 *
 * Sin `inline` tiene scroll propio y ocupa el alto libre del padre (flex).
 */
@Component({
  selector: 'app-item-list',
  imports: [Icon, NgTemplateOutlet, Surface, Text],
  providers: [Accordion],
  host: { '[class]': 'hostClasses()' },
  template: `
    <ng-template #toolbar><ng-content select="[toolbar]" /></ng-template>
    @if (toolbarSurface()) {
      <div
        appSurface
        [tone]="tone() ?? 'dark'"
        class="flex items-center justify-between gap-3 rounded-lg p-3 empty:hidden"
      >
        <ng-container *ngTemplateOutlet="toolbar" />
      </div>
    } @else {
      <div class="flex items-center justify-between gap-3 px-1 empty:hidden">
        <ng-container *ngTemplateOutlet="toolbar" />
      </div>
    }

    <div #scroller appSurface [tone]="tone()" [class]="bodyClasses()">
      <div [class]="contentClasses()">
        @if (items().length) {
          <ul [class]="listClasses()" [attr.aria-busy]="loading() || null">
            @for (item of items(); track item.id) {
              <li class="flex min-w-0 flex-col">
                <ng-container
                  *ngTemplateOutlet="itemTemplate().template; context: { $implicit: item }"
                />
              </li>
            }
          </ul>
        }
        @if (loading()) {
          <div class="flex justify-center" role="status" aria-label="Cargando">
            <app-icon [icon]="loader" size="xl" class="animate-spin" />
          </div>
        } @else if (failed()) {
          <p appText="caption" role="alert" class="pt-3 text-center">No se pudo cargar la lista</p>
        } @else if (!items().length) {
          <p appText="caption" class="pt-3 text-center">Sin resultados</p>
        }
      </div>
      <div #sentinel aria-hidden="true" class="h-px shrink-0"></div>
    </div>
  `,
})
export class ItemList<T extends { id: string | number }> {
  readonly items = input.required<readonly T[]>();
  readonly loading = input(false, { transform: booleanAttribute });
  /** Fallo al cargar: se muestra en lugar de "Sin resultados" o al final. */
  readonly error = input<unknown>();
  protected readonly failed = computed(() => this.error() != null);
  /**
   * Dibujar el toolbar sobre su propia superficie (por defecto sí).
   * Con `false` queda sin fondo, sobre lo que haya detrás, y sus botones
   * toman el tono de ese fondo, no el de `tone`.
   */
  readonly toolbarSurface = input(true, { transform: booleanAttribute });
  /**
   * Tono de la lista y de su toolbar (cuando tiene superficie).
   * Sin `tone`: la lista hereda el del padre (sobre canvas pasa a light) y
   * el toolbar es dark.
   */
  readonly tone = input<Tone>();
  readonly columns = input(1);
  readonly compactColumns = input(1);
  /** Separación entre filas. */
  readonly gap = input(true, { transform: booleanAttribute });
  /** Sin scroll propio: los elementos se dibujan en la página, que scrollea. */
  readonly inline = input(false, { transform: booleanAttribute });

  /** Se llegó (o casi) al final: pedir la página siguiente. */
  readonly endReached = output();

  protected readonly itemTemplate = contentChild.required<ItemTemplate<T>>(ItemTemplate);
  protected readonly loader = LucideLoaderCircle;

  private readonly inSection = inject(IN_SECTION);
  private readonly layout = injectLayoutMode();
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
  private readonly sentinel = viewChild.required<ElementRef<HTMLElement>>('sentinel');
  private readonly atEnd = signal(false);

  private readonly numColumns = computed(() =>
    this.layout.isExpanded() ? this.columns() : this.compactColumns(),
  );
  private readonly multi = computed(() => this.numColumns() > 1);

  protected readonly hostClasses = computed(() =>
    cn(
      'flex flex-col',
      this.toolbarSurface() ? 'gap-4' : 'gap-3',
      !this.inline() && 'min-h-0 flex-1',
    ),
  );

  protected readonly bodyClasses = computed(() =>
    cn('flex flex-col', !this.inline() && 'min-h-0 flex-1 overflow-y-auto'),
  );

  private readonly pad = computed(() =>
    this.multi() ? (this.inSection ? 'py-6' : 'p-6') : this.inSection ? 'py-4' : 'p-4',
  );

  private readonly rowGap = computed(() => this.gap() && (this.multi() ? 'gap-y-7' : 'gap-y-4'));

  protected readonly contentClasses = computed(() =>
    cn('flex flex-col', this.pad(), this.rowGap()),
  );

  protected readonly listClasses = computed(() =>
    cn(
      'grid',
      gridCols[this.numColumns()] ?? gridCols[1],
      this.multi() && 'gap-x-6',
      this.rowGap(),
    ),
  );

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const observer = new IntersectionObserver(([entry]) => this.atEnd.set(entry.isIntersecting), {
        root: this.inline() ? null : this.scroller().nativeElement,
        rootMargin: '0px 0px 50% 0px',
      });
      observer.observe(this.sentinel().nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
    });

    // Pide una vez por cada largo de lista: si la página siguiente vino
    // vacía, no vuelve a pedir hasta que cambien los elementos.
    let requestedAt = -1;
    effect(() => {
      const length = this.items().length;
      if (!this.atEnd() || this.loading() || this.failed() || !length) return;
      if (length === requestedAt) return;
      requestedAt = length;
      untracked(() => this.endReached.emit());
    });
  }
}
