import {
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Injectable,
  signal,
  type Signal,
} from '@angular/core';

/** Desde este ancho de contenido, las pantallas usan el diseño expandido. */
const EXPANDED_MIN_WIDTH = 800;

/** Ancho del área de contenido más cercana (sin el menú lateral). */
export abstract class ContentWidth {
  abstract readonly width: Signal<number>;
}

/** Ancho de la ventana, para cuando no hay un ContentArea arriba. */
@Injectable({ providedIn: 'root' })
class WindowWidth implements ContentWidth {
  private readonly current = signal(typeof window === 'undefined' ? 0 : window.innerWidth);
  readonly width = this.current.asReadonly();

  constructor() {
    if (typeof window === 'undefined') return;
    const update = () => this.current.set(window.innerWidth);
    window.addEventListener('resize', update, { passive: true });
    inject(DestroyRef).onDestroy(() => window.removeEventListener('resize', update));
  }
}

/** Mide su propio ancho y lo da a lo que tenga adentro (`injectLayoutMode`). */
@Directive({
  selector: '[appContentArea]',
  providers: [{ provide: ContentWidth, useExisting: ContentArea }],
})
export class ContentArea implements ContentWidth {
  private readonly current = signal(0);
  readonly width = this.current.asReadonly();

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const observer = new ResizeObserver(([entry]) =>
      this.current.set(Math.round(entry.contentRect.width)),
    );
    observer.observe(el);
    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }
}

export interface LayoutMode {
  readonly isExpanded: Signal<boolean>;
  readonly contentWidth: Signal<number>;
}

/** Expandido o compacto según el ancho del contenido. Requiere contexto de inyección. */
export function injectLayoutMode(): LayoutMode {
  const area = inject(ContentWidth, { optional: true }) ?? inject(WindowWidth);
  return {
    contentWidth: area.width,
    isExpanded: computed(() => area.width() >= EXPANDED_MIN_WIDTH),
  };
}
