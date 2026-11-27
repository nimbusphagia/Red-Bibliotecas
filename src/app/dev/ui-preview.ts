import { Dialog } from '@angular/cdk/dialog';
import { NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  StatusBadge,
  StatusChip,
  StatusIcon,
  StatusIndicator,
  Surface,
  Text,
} from '../shared/components';

@Component({
  selector: 'app-preview-dialog',
  imports: [DialogShell, DialogHeader, DialogBody, DialogActions, Text],
  template: `
    <app-dialog size="sm">
      <app-dialog-header title="Nuevo estante" subtitle="Ejemplo de diálogo" />
      <app-dialog-body>
        <p appText="item">Escape o click afuera lo cierran. El foco vuelve al botón.</p>
      </app-dialog-body>
      <app-dialog-actions confirmLabel="Guardar" />
    </app-dialog>
  `,
})
class PreviewDialog {}

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
    StatusBadge,
    StatusChip,
    StatusIcon,
    StatusIndicator,
    Surface,
    Text,
  ],
  host: { class: 'flex flex-col gap-6 p-8' },
  template: `
    <app-page-header title="Componentes base" subtitle="Vitrina temporal">
      <div search appSurface inset class="px-4 py-2.5 text-faint">Buscador (pendiente)</div>
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
          <app-status-badge variant="active" text="Activo" />
          <app-status-badge variant="pending" text="Pendiente" />
          <app-status-badge variant="finished" text="Finalizado" />
        </div>
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
          <app-icon [icon]="icons.alert" tone="text-warning" />
        </div>
      </app-panel>
    </div>

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
