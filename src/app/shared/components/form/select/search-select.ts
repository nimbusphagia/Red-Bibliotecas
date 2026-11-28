import { _IdGenerator } from '@angular/cdk/a11y';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option as ListboxOption } from '@angular/aria/listbox';
import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
  type ElementRef,
  inject,
  Injector,
  input,
  model,
  output,
  resource,
  signal,
  viewChild,
} from '@angular/core';
import type { FormValueControl, ValidationError } from '@angular/forms/signals';
import { LucideDot, LucideX } from '@lucide/angular';
import { cn } from '../../../theme';
import { debounced } from '../../../utils/debounced';
import { Icon } from '../../base/icon';
import { Text } from '../../base/text';
import { FieldError } from '../field-error';
import type { Option } from './option';

const CLEAR = Symbol('clear');
const CREATE = Symbol('create');
type Pick = Option<string | number>['id'] | typeof CLEAR | typeof CREATE;

const row =
  'flex cursor-pointer items-center gap-2 px-4 py-3 hover:bg-idle data-[active=true]:bg-idle';

/**
 * Elegir una opción de muchas buscando (las trae `fetchOptions`). Cerrado
 * muestra el valor; al abrirlo aparece el buscador y la lista.
 * Teclado: flechas para moverse, Enter elige, Escape cierra.
 * Con Signal Forms: `<app-search-select [formField]="form.author" [fetchOptions]="..." />`.
 */
@Component({
  selector: 'app-search-select',
  imports: [
    Combobox,
    ComboboxPopup,
    ComboboxWidget,
    FieldError,
    Icon,
    Listbox,
    ListboxOption,
    Text,
  ],
  host: { class: 'flex flex-col gap-2', '[class.opacity-80]': 'disabled()' },
  template: `
    @if (label()) {
      <span appText="item" [id]="labelId">{{ label() }}</span>
    }

    @if (noOptions()) {
      <div class="flex h-12 items-center rounded-lg bg-inset px-4">
        <span appText="caption">Sin resultados</span>
      </div>
    } @else if (open()) {
      <div
        class="flex h-12 items-center gap-2 rounded-lg bg-inset px-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent-lg"
      >
        <input
          #input
          ngCombobox
          #combobox="ngCombobox"
          [(value)]="search"
          [(expanded)]="open"
          (expandedChange)="onExpandedChange($event)"
          (keydown.escape)="$event.stopPropagation(); restoreFocus()"
          [placeholder]="value()?.label ?? 'Buscar...'"
          [attr.aria-labelledby]="label() ? labelId : null"
          [attr.aria-label]="label() ? null : placeholder()"
          class="h-full min-w-0 flex-1 bg-transparent font-sans text-fg outline-none placeholder:text-faint"
        />
        <button
          type="button"
          aria-label="Cerrar"
          class="cursor-pointer rounded p-1 focus-visible:outline-2 focus-visible:outline-accent-lg"
          (click)="close()"
        >
          <app-icon [icon]="icons.x" />
        </button>
      </div>

      <ng-template ngComboboxPopup [combobox]="combobox">
        <div class="max-h-60 overflow-y-auto rounded-lg bg-inset">
          <div
            ngComboboxWidget
            ngListbox
            #listbox="ngListbox"
            selectionMode="explicit"
            focusMode="activedescendant"
            [activeDescendant]="listbox.activeDescendant()"
            [attr.aria-labelledby]="label() ? labelId : null"
            (valueChange)="onPick($event)"
          >
            @if (value()) {
              <div ngOption [value]="clear" label="Quitar selección" [class]="row">
                <span appText="item">Quitar selección</span>
              </div>
            }
            @if (canCreate()) {
              <div ngOption [value]="create" [label]="'Crear ' + typed()" [class]="row">
                <span appText="itemSm" class="font-semibold">Crear «{{ typed() }}»</span>
              </div>
            }
            @for (o of options(); track o.id) {
              <div ngOption [value]="o.id" [label]="o.label" [class]="row">
                <span class="flex min-w-0 shrink items-center">
                  <span appText="itemSm">{{ o.label }}</span>
                  @if (o.detail) {
                    <app-icon [icon]="icons.dot" tone="faint" />
                    <span appText="itemSm" class="truncate">{{ o.detail }}</span>
                  }
                </span>
                @if (o.caption) {
                  <span appText="caption" class="ml-auto truncate">{{ o.caption }}</span>
                }
              </div>
            }
          </div>
          @if (options().length === 0 && !canCreate()) {
            <p appText="caption" class="px-4 py-3 text-center">
              {{ results.isLoading() ? 'Buscando...' : 'Sin resultados' }}
            </p>
          }
        </div>
      </ng-template>
    } @else {
      <button
        #trigger
        type="button"
        [id]="triggerId"
        aria-haspopup="listbox"
        [attr.aria-labelledby]="label() ? labelId + ' ' + triggerId : null"
        [disabled]="disabled()"
        [class]="triggerClasses()"
        (click)="openPopup()"
      >
        <span appText="itemSm">{{ value()?.label ?? placeholder() }}</span>
      </button>
    }

    <app-field-error [message]="errorMessage()" />
  `,
})
export class SearchSelect<
  Id extends string | number = number,
> implements FormValueControl<Option<Id> | null> {
  readonly value = model<Option<Id> | null>(null);
  readonly label = input<string>();
  readonly fetchOptions = input.required<(search: string) => Promise<Option<Id>[]>>();
  /** Lo que se ve cerrado y sin valor. */
  readonly placeholder = input('Todos');
  /** Ofrece "Crear «texto»" cuando lo buscado no existe; emite `(created)`. */
  readonly creatable = input(false, { transform: booleanAttribute });
  /** Emite la opción sin guardarla como valor (lo usa MultiSearchSelect). */
  readonly pickOnly = input(false, { transform: booleanAttribute });
  readonly created = output<string>();
  readonly picked = output<Option<Id>>();

  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly touch = output();

  private readonly injector = inject(Injector);
  private readonly input = viewChild<ElementRef<HTMLInputElement>>('input');
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');

  protected readonly icons = { dot: LucideDot, x: LucideX };
  protected readonly clear = CLEAR;
  protected readonly create = CREATE;
  protected readonly row = row;

  private readonly ids = inject(_IdGenerator);
  protected readonly labelId = this.ids.getId('app-search-select-label-');
  protected readonly triggerId = this.ids.getId('app-search-select-trigger-');

  protected readonly open = signal(false);
  protected readonly search = signal('');
  private readonly query = debounced(this.search);
  protected readonly typed = computed(() => this.query().trim());

  // `fetch` en params: si cambia la función (p. ej. series de otro autor), vuelve a pedir.
  protected readonly results = resource({
    params: () => ({ search: this.query(), fetch: this.fetchOptions() }),
    loader: ({ params }) => params.fetch(params.search),
  });
  protected readonly options = computed(() =>
    this.results.hasValue() ? this.results.value() : [],
  );

  /** Sin nada que elegir ni crear: se muestra "Sin resultados" en vez del select. */
  protected readonly noOptions = computed(
    () =>
      this.query() === '' &&
      this.results.hasValue() &&
      this.options().length === 0 &&
      !this.value() &&
      !this.creatable(),
  );
  protected readonly canCreate = computed(() => {
    const typed = this.typed().toLowerCase();
    return (
      this.creatable() &&
      typed !== '' &&
      !this.options().some((o) => o.label.toLowerCase() === typed)
    );
  });

  protected readonly errorMessage = computed(() =>
    this.touched() && this.invalid()
      ? (this.errors().find((e) => e.message)?.message ?? null)
      : null,
  );
  protected readonly triggerClasses = computed(() =>
    cn(
      'flex h-12 w-full cursor-pointer items-center rounded-lg border px-4 text-left',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-lg',
      'disabled:cursor-not-allowed',
      this.value() ? 'bg-accent-md text-dark-1' : 'bg-inset',
      this.errorMessage() ? 'border-accent-neg' : 'border-transparent',
    ),
  );

  protected openPopup() {
    this.search.set('');
    this.open.set(true);
    afterNextRender(() => this.input()?.nativeElement.focus(), { injector: this.injector });
  }

  /** Cierra y devuelve el foco al botón. */
  protected close() {
    this.open.set(false);
    this.restoreFocus();
  }

  protected restoreFocus() {
    this.touch.emit();
    afterNextRender(() => this.trigger()?.nativeElement.focus(), { injector: this.injector });
  }

  /** El combobox se cierra solo al salir de él (blur): cuenta como tocado. */
  protected onExpandedChange(expanded: boolean) {
    if (!expanded) this.touch.emit();
  }

  protected onPick(values: readonly Pick[]) {
    const picked = values[0];
    if (picked === undefined) return;
    if (picked === CLEAR) {
      this.value.set(null);
    } else if (picked === CREATE) {
      this.created.emit(this.typed());
    } else {
      const option = this.options().find((o) => o.id === picked);
      if (!option) return;
      this.picked.emit(option);
      if (!this.pickOnly()) this.value.set(option);
    }
    this.close();
  }

  focus(options?: FocusOptions) {
    (this.input() ?? this.trigger())?.nativeElement.focus(options);
  }
}
