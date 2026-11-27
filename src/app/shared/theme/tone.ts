/**
 * Tono de la superficie donde se está dibujando. Los colores de cada rol
 * (bg-surface, bg-inset, text-fg, text-muted...) están en styles.css y se
 * heredan por CSS: los componentes usan esos roles y no eligen colores propios.
 * Si un componente necesita un color nuevo, se agrega como rol allá.
 */
export type Tone = 'canvas' | 'light' | 'dark';

interface Box {
  box: string;
  label: string;
}

/**
 * Colores con significado (estado). No dependen del tono: se ven igual sobre
 * cualquier superficie.
 */
export const status = {
  success: { text: 'text-success', bg: 'bg-success' },
  info: { text: 'text-secondary', bg: 'bg-secondary' },
  warning: { text: 'text-warning', bg: 'bg-warning' },
  error: { text: 'text-accent-neg', bg: 'bg-accent-neg', border: 'border-accent-neg' },
} as const;

/** Ítem activo del sidebar. */
export const navActive: Box = { box: 'bg-light-1', label: 'text-dark-1' };

export type AccentLevel = 'sm' | 'md' | 'lg' | 'neg' | 'dark';

/**
 * Acentos para chips de valor (serie, reputación...), de menor a mayor
 * intensidad; `neg` es el resaltado negativo urgente y `dark` el chip oscuro
 * neutro. No dependen del tono. Los íconos usan currentColor (= label).
 */
export const accents: Record<AccentLevel, Box> = {
  sm: { box: 'bg-accent-sm', label: 'text-dark-1' },
  md: { box: 'bg-accent-md', label: 'text-dark-1' },
  lg: { box: 'bg-accent-lg', label: 'text-light-1' },
  neg: { box: 'bg-accent-neg', label: 'text-light-1' },
  dark: { box: 'bg-dark-solid', label: 'text-light-1' },
};
