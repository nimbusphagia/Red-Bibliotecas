import { booleanAttribute, Component, computed, Directive, input } from '@angular/core';
import { LucideLoaderCircle, type LucideIconInput } from '@lucide/angular';
import { accents, cn, type AccentLevel } from '../../theme';
import { Icon, type IconSize, type IconTone } from './icon';

/** `ghost`: sin fondo, solo el texto del tono actual. */
type Variant = 'accent' | 'active' | 'solid' | 'soft' | 'selector' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

// `active`: opción elegida de filtros y orden (hoy igual que accent).
const variants: Record<Variant, string> = {
  accent: 'bg-accent-md text-dark-1',
  active: 'bg-accent-md text-dark-1',
  solid: 'bg-dark-solid text-light-1',
  soft: 'bg-soft text-soft-fg',
  selector: 'bg-idle text-idle-fg',
  ghost: 'bg-transparent text-fg',
};

const sizeStyles: Record<Size, { withLabel: string; iconOnly: string; icon: IconSize }> = {
  sm: { withLabel: 'min-h-9 px-4', iconOnly: 'size-9', icon: 'sm' },
  md: { withLabel: 'min-h-9 px-4', iconOnly: 'size-9', icon: 'md' },
  lg: { withLabel: 'min-h-12 px-6', iconOnly: 'size-12', icon: 'md' },
};

const weights: Record<Size, string> = {
  sm: 'font-light',
  md: 'font-normal',
  lg: 'font-medium',
};

/** Lo que comparten Button e IconButton: variante, tamaño, estados. */
@Directive()
abstract class ButtonBase {
  protected readonly loader = LucideLoaderCircle;
  protected abstract readonly iconOnly: boolean;

  readonly icon = input<LucideIconInput>();
  readonly iconTone = input<IconTone>();
  readonly iconSize = input<IconSize>();
  readonly variant = input<Variant>('solid');
  /** Reemplaza los colores de la variante. */
  readonly accent = input<AccentLevel>();
  readonly size = input<Size>('md');
  readonly weight = input<Size>('sm');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly isDisabled = computed(() => this.disabled() || this.loading());

  protected readonly resolvedIconSize = computed<IconSize>(() => {
    const s = sizeStyles[this.size()];
    return this.iconSize() ?? (this.iconOnly && s.icon === 'md' ? 'lg' : s.icon);
  });

  protected readonly classes = computed(() => {
    const accent = this.accent();
    const s = sizeStyles[this.size()];
    return cn(
      'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg select-none',
      'transition hover:brightness-95 active:opacity-80',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-lg',
      'disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:brightness-100',
      this.iconOnly ? s.iconOnly : s.withLabel,
      this.size() === 'sm' ? 'text-[13px]' : 'text-[15px]',
      weights[this.weight()],
      accent ? cn(accents[accent].box, accents[accent].label) : variants[this.variant()],
    );
  });
}

const host = {
  '[class]': 'classes()',
  '[attr.disabled]': 'isDisabled() || null',
  '[attr.aria-busy]': 'loading() || null',
};

/** `<button app-button [icon]="LucideSave">Guardar</button>` */
@Component({
  selector: 'button[app-button], a[app-button]',
  imports: [Icon],
  host,
  template: `
    @if (loading()) {
      <app-icon [icon]="loader" [size]="resolvedIconSize()" class="animate-spin" />
    } @else if (icon() && iconPosition() === 'start') {
      <app-icon
        [icon]="icon()!"
        [size]="resolvedIconSize()"
        [tone]="iconTone()"
        [stroke]="weight()"
      />
    }
    <span class="truncate"><ng-content /></span>
    @if (!loading() && icon() && iconPosition() === 'end') {
      <app-icon
        [icon]="icon()!"
        [size]="resolvedIconSize()"
        [tone]="iconTone()"
        [stroke]="weight()"
      />
    }
  `,
})
export class Button extends ButtonBase {
  protected readonly iconOnly = false;
  readonly iconPosition = input<'start' | 'end'>('start');
}

/** Solo ícono: `<button app-icon-button [icon]="LucideFilter" aria-label="Filtros">`. */
@Component({
  selector: 'button[app-icon-button], a[app-icon-button]',
  imports: [Icon],
  host,
  template: `
    <app-icon
      [icon]="loading() ? loader : icon()!"
      [size]="resolvedIconSize()"
      [tone]="iconTone()"
      [stroke]="weight()"
      [class.animate-spin]="loading()"
    />
  `,
})
export class IconButton extends ButtonBase {
  protected readonly iconOnly = true;
}
