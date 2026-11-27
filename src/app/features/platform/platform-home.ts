import { Component } from '@angular/core';
import { PageHeader, Panel, Text } from '../../shared/components';

/** Inicio provisional del área de plataforma. */
@Component({
  selector: 'app-platform-home',
  imports: [PageHeader, Panel, Text],
  host: { class: 'flex flex-col gap-6 p-8' },
  template: `
    <app-page-header title="Plataforma" subtitle="Owner y admins" />
    <app-panel title="Próximamente">
      <p appText="item">Instituciones, planes y alta de administradores.</p>
    </app-panel>
  `,
})
export class PlatformHome {}
