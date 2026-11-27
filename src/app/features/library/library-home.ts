import { Component } from '@angular/core';
import { PageHeader, Panel, Text } from '../../shared/components';

/** Inicio provisional del área de biblioteca. */
@Component({
  selector: 'app-library-home',
  imports: [PageHeader, Panel, Text],
  host: { class: 'flex flex-col gap-6 p-8' },
  template: `
    <app-page-header title="Biblioteca" subtitle="Bibliotecarios y staff" />
    <app-panel title="Próximamente">
      <p appText="item">Catálogo, préstamos y socios.</p>
    </app-panel>
  `,
})
export class LibraryHome {}
