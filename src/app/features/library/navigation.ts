import {
  LucideClipboardClock,
  LucideHouse,
  LucideLibraryBig,
  LucideNotebookPen,
  LucideShelvingUnit,
  LucideUserRound,
  LucideUsers,
} from '@lucide/angular';
import type { Navbar } from '../../shared/components';

export const LIBRARY_NAV: Navbar = {
  main: [
    { key: 'home', label: 'Inicio', href: '/inicio', icon: LucideHouse },
    { key: 'books', label: 'Libros', href: '/libros', icon: LucideLibraryBig },
    { key: 'loans', label: 'Préstamos', href: '/prestamos', icon: LucideNotebookPen },
    { key: 'visitors', label: 'Visitantes', href: '/visitantes', icon: LucideUsers },
    { key: 'shelves', label: 'Organización', href: '/organizacion', icon: LucideShelvingUnit },
    { key: 'stock', label: 'Inventario', href: '/inventario', icon: LucideClipboardClock },
  ],
  footer: [{ key: 'account', label: 'Usuario', href: '/cuenta', icon: LucideUserRound }],
};
