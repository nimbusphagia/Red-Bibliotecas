import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { LucideIconInput } from '@lucide/angular';
import { cn, navActive } from '../../theme';
import { Icon } from '../base/icon';
import { Surface } from '../base/surface';

export interface NavItem {
  key: string;
  label: string;
  /** Ruta absoluta. El ítem queda activo en ella y en sus subrutas. */
  href: string;
  icon: LucideIconInput;
}

/** Ítems de arriba (`main`) y de abajo (`footer`) del menú lateral. */
export interface Navbar {
  main: readonly NavItem[];
  footer: readonly NavItem[];
}

/** Se dibuja sobre una Surface dark: inactivo = su inset. El activo va en claro. */
@Component({
  selector: 'app-sidebar-item',
  imports: [Icon, RouterLink, RouterLinkActive],
  template: `
    <a
      [routerLink]="item().href"
      routerLinkActive
      #rla="routerLinkActive"
      ariaCurrentWhenActive="page"
      [attr.aria-label]="item().label"
      [attr.title]="item().label"
      [class]="classes(rla.isActive)"
    >
      <app-icon [icon]="item().icon" size="xl" stroke="sm" />
    </a>
  `,
})
export class SidebarItem {
  readonly item = input.required<NavItem>();

  protected classes(active: boolean) {
    return cn(
      'flex items-center justify-center rounded-xl p-2.5 transition hover:brightness-95',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-lg',
      active ? cn(navActive.box, navActive.label) : 'bg-inset',
    );
  }
}

/** Menú lateral de un área. Su ancho es fijo: 96px (`w-24`). */
@Component({
  selector: 'app-sidebar',
  imports: [SidebarItem, Surface],
  host: {
    role: 'navigation',
    class: 'flex w-24 shrink-0 flex-col items-center justify-between pt-4 pr-2 pb-10 pl-4',
  },
  template: `
    <div appSurface tone="dark" class="flex flex-col gap-6 px-4 py-5">
      @for (item of nav().main; track item.key) {
        <app-sidebar-item [item]="item" />
      }
    </div>
    <div appSurface tone="dark" class="flex flex-col gap-6 p-4">
      @for (item of nav().footer; track item.key) {
        <app-sidebar-item [item]="item" />
      }
    </div>
  `,
})
export class Sidebar {
  readonly nav = input.required<Navbar>();
}
