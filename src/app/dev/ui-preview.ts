import { Dialog } from '@angular/cdk/dialog';
import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  form,
  FormField,
  readonly,
  required,
  submit,
  validateStandardSchema,
} from '@angular/forms/signals';
import {
  LucideBookOpen,
  LucideCircleCheck,
  LucideFilter,
  LucidePlus,
  LucideSave,
  LucideTriangleAlert,
} from '@lucide/angular';
import {
  ActiveCounter,
  Button,
  IconButton,
  DialogActions,
  DialogBody,
  DialogHeader,
  DialogShell,
  Icon,
  PageHeader,
  Panel,
  StatusChip,
  StatusIcon,
  StatusIndicator,
  Surface,
  Text,
  ChipGroup,
  ChipRow,
  Chip,
  FieldError,
  FieldRow,
  MultiSearchSelect,
  type Option,
  SearchSelect,
  SimpleSelect,
  LabeledItem,
  Searchbar,
  TextField,
} from '../shared/components';
import { z } from 'zod';

const authors: Option[] = [
  { id: 1, label: 'Borges', detail: 'Argentina', caption: '12 libros' },
  { id: 2, label: 'Cortázar', detail: 'Argentina', caption: '8 libros' },
  { id: 3, label: 'Mistral', detail: 'Chile', caption: '5 libros' },
  { id: 4, label: 'Neruda', detail: 'Chile', caption: '9 libros' },
  { id: 5, label: 'Rulfo', detail: 'México', caption: '2 libros' },
];

/** Simula la búsqueda en el backend. */
async function fetchAuthors(search: string): Promise<Option[]> {
  await new Promise((r) => setTimeout(r, 150));
  const q = search.toLowerCase();
  return authors.filter((a) => a.label.toLowerCase().includes(q));
}

const shelfSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.email('Correo no válido').or(z.literal('')),
});

@Component({
  selector: 'app-preview-dialog',
  imports: [
    DialogShell,
    DialogHeader,
    DialogBody,
    DialogActions,
    FieldError,
    FormField,
    SearchSelect,
    TextField,
  ],
  template: `
    <app-dialog size="sm">
      <app-dialog-header title="Nuevo estante" subtitle="Signal Forms + zod" />
      <app-dialog-body>
        <app-text-field label="Nombre" [formField]="form.name" helperText="Prueba con «Central»" />
        <app-text-field
          label="Correo"
          type="email"
          placeholder="Opcional"
          [formField]="form.email"
        />
        <app-text-field label="Clave" type="password" [formField]="form.password" />
        <app-search-select
          label="Autor"
          placeholder="Elegir autor"
          [fetchOptions]="fetchAuthors"
          [formField]="form.author"
        />
        <app-field-error [message]="formError()" />
      </app-dialog-body>
      <app-dialog-actions
        confirmLabel="Guardar"
        [loading]="form().submitting()"
        (confirmed)="save()"
      />
    </app-dialog>
  `,
})
class PreviewDialog {
  private readonly model = signal({
    name: '',
    email: '',
    password: '',
    author: null as Option | null,
  });
  protected readonly form = form(this.model, (f) => {
    validateStandardSchema(f, shelfSchema);
    required(f.password, { message: 'Requerida' });
    required(f.author, { message: 'Elige un autor' });
  });
  protected readonly formError = signal<string | null>(null);
  protected readonly fetchAuthors = fetchAuthors;

  protected save() {
    void submit(this.form, async (f) => {
      await new Promise((r) => setTimeout(r, 600));
      // Simula un error del backend asociado a un campo.
      if (f.name().value() === 'Central') {
        return {
          fieldTree: f.name,
          kind: 'server',
          message: 'Ya existe un estante con ese nombre',
        };
      }
      this.formError.set('Guardado (simulado)');
      return undefined;
    });
  }
}

/** Vitrina temporal de los componentes base. Se borra cuando haya pantallas reales. */
@Component({
  selector: 'app-ui-preview',
  imports: [
    ActiveCounter,
    Button,
    Icon,
    IconButton,
    NgTemplateOutlet,
    PageHeader,
    Panel,
    StatusChip,
    StatusIcon,
    StatusIndicator,
    Surface,
    Text,
    TextField,
    Searchbar,
    FieldRow,
    LabeledItem,
    FormField,
    Chip,
    ChipGroup,
    ChipRow,
    SimpleSelect,
    SearchSelect,
    MultiSearchSelect,
  ],
  host: { class: 'flex flex-col gap-6 p-8' },
  template: `
    <app-page-header title="Componentes base" subtitle="Vitrina temporal">
      <app-searchbar search [(value)]="query" />
      <button app-button variant="accent" [icon]="icons.plus" (click)="openDialog()">Nuevo</button>
    </app-page-header>

    <div class="grid gap-6 lg:grid-cols-2">
      <app-panel title="Tipografía" [icon]="icons.book">
        <p appText="display">Display</p>
        <p appText="title">Title</p>
        <p appText="section">Section</p>
        <p appText="item">Item</p>
        <p appText="itemSm">Item sm</p>
        <p appText="caption">Caption</p>
      </app-panel>

      <app-panel title="Botones" subtitle="Sobre light">
        <button lead app-button size="sm" variant="selector" [icon]="icons.filter">Acción</button>
        <ng-container *ngTemplateOutlet="buttons" />
      </app-panel>

      <section appSurface tone="dark" class="flex flex-col gap-4 p-5">
        <h2 appText="section">Sobre dark</h2>
        <ng-container *ngTemplateOutlet="buttons" />
        <div appSurface inset class="p-3">
          <p appText="caption">Inset dentro de dark</p>
        </div>
      </section>

      <app-panel title="Estados">
        <div class="flex flex-wrap items-center gap-3">
          <app-status-icon [icon]="icons.check" accent="md" />
          <app-status-icon [icon]="icons.alert" accent="neg" />
          <app-status-chip [icon]="icons.check" text="Buena" accent="lg" />
          <app-status-chip [icon]="icons.alert" text="Sin acento" />
        </div>
        <app-status-indicator [icon]="icons.check" accent="sm" text="Indicador" />
        <div class="flex items-center gap-3">
          <app-icon [icon]="icons.book" size="xl" />
          <app-icon [icon]="icons.book" tone="faint" />
          <app-icon [icon]="icons.alert" tone="text-accent-neg" />
        </div>
      </app-panel>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <app-panel title="Campos" subtitle="Sobre light">
        <ng-container *ngTemplateOutlet="fields" />
      </app-panel>
      <section appSurface tone="dark" class="flex flex-col gap-4 p-5">
        <h2 appText="section">Campos sobre dark</h2>
        <ng-container *ngTemplateOutlet="fields" />
      </section>
      <app-panel title="LabeledItem">
        <app-labeled-item label="Autor" content="Borges" labelWidth="form" />
        <app-labeled-item label="Editorial" labelWidth="form" />
        <app-labeled-item label="Serie" content="Ficciones" accent="lg" labelWidth="form" />
      </app-panel>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <app-panel title="Selects" subtitle="Sobre light">
        <ng-container *ngTemplateOutlet="selects" />
      </app-panel>
      <section appSurface tone="dark" class="flex flex-col gap-4 p-5">
        <h2 appText="section">Selects sobre dark</h2>
        <ng-container *ngTemplateOutlet="selects" />
      </section>
      <app-panel title="Chips">
        <app-chip-group>
          <span app-chip>Idle</span>
          <span app-chip selected>Elegido</span>
          <span app-chip detail="3">Con detalle</span>
          <span app-chip accent="lg">Acento</span>
          <span app-chip shape="pill">Pill</span>
          <span app-chip shape="circle">+4</span>
        </app-chip-group>
        <p appText="caption">ChipRow (cambia el ancho de la ventana):</p>
        <app-chip-row [chips]="tags" />
        <div class="w-60"><app-chip-row [chips]="tags" /></div>
      </app-panel>
    </div>

    <ng-template #selects>
      <app-simple-select label="Estado" [options]="states" [formField]="demo.state" />
      <app-search-select label="Autor" [fetchOptions]="fetchAuthors" [formField]="demo.author" />
      <app-search-select
        label="Editorial"
        creatable
        [fetchOptions]="fetchAuthors"
        [formField]="demo.publisher"
        (created)="lastCreated.set($event)"
      />
      <app-multi-search-select
        label="Coautores"
        [fetchOptions]="fetchAuthors"
        [formField]="demo.coauthors"
      />
      <p appText="captionXs">
        Estado: {{ demo.state().value() ?? '—' }} · Autor:
        {{ demo.author().value()?.label ?? '—' }} · Creado: {{ lastCreated() ?? '—' }} · Coautores:
        {{ demo.coauthors().value().length }}
      </p>
    </ng-template>

    <ng-template #fields>
      <app-text-field label="Título" placeholder="Ej: El Aleph" [formField]="demo.title" />
      <app-text-field label="Solo lectura" [formField]="demo.code" />
      <app-field-row
        label="Estante"
        [value]="shelf()"
        (opened)="shelf.set(shelf() ? null : 'A-12')"
      />
      <app-field-row label="Sección" error="Elige una sección" (opened)="shelf.set('B-03')" />
      <app-searchbar [(value)]="query" placeholder="Buscar libros..." />
      <p appText="captionXs">Búsqueda: «{{ query() }}»</p>
    </ng-template>

    <ng-template #buttons>
      <div class="flex flex-wrap items-center gap-2">
        <button app-button variant="accent">Accent</button>
        <button app-button variant="solid" [icon]="icons.save">Solid</button>
        <button app-button variant="soft">Soft</button>
        <button app-button variant="selector">Selector</button>
        <button app-button variant="ghost">Ghost</button>
        <button app-button accent="neg">Neg</button>
        <button app-button loading>Cargando</button>
        <button app-button disabled>Deshabilitado</button>
        <span class="relative">
          <button
            app-icon-button
            variant="soft"
            [icon]="icons.filter"
            aria-label="Filtros"
          ></button>
          <app-active-counter [count]="3" />
        </span>
      </div>
    </ng-template>
  `,
})
export class UiPreview {
  private readonly dialog = inject(Dialog);

  protected readonly query = signal('');
  protected readonly shelf = signal<string | null>(null);
  protected readonly demo = form(
    signal({
      title: '',
      code: 'LIB-0042',
      state: null as 'active' | 'pending' | 'done' | null,
      author: null as Option | null,
      publisher: null as Option | null,
      coauthors: [] as readonly Option[],
    }),
    (f) => readonly(f.code),
  );
  protected readonly fetchAuthors = fetchAuthors;
  protected readonly lastCreated = signal<string | null>(null);
  protected readonly states = [
    { id: 'active' as const, label: 'Activo', accent: 'sm' as const },
    { id: 'pending' as const, label: 'Pendiente' },
    { id: 'done' as const, label: 'Finalizado', accent: 'dark' as const },
  ];
  protected readonly tags = [
    'Novela',
    'Cuento',
    'Poesía',
    'Ensayo',
    'Teatro',
    'Crónica',
    'Biografía',
  ].map((label) => ({ label }));

  protected readonly icons = {
    alert: LucideTriangleAlert,
    book: LucideBookOpen,
    check: LucideCircleCheck,
    filter: LucideFilter,
    plus: LucidePlus,
    save: LucideSave,
  };

  protected openDialog() {
    this.dialog.open(PreviewDialog);
  }
}
