import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'city-button',
  standalone: true,
  imports: [MatButtonModule, NgTemplateOutlet],
  templateUrl: './city-button.html',
  styleUrl: './city-button.scss',
})
export class CityButton {
  size = input<'sm' | 'md' | 'lg'>('md');
  length = input<'auto' | 'full'>('auto');
  variant = input<'primary' | 'secondary' | 'destructive'>('primary');
  disabled = input(false);

  // Turns out `@layer material` in styles.scss only wraps what WE write
  // there (mat.core()/mat.theme() token output) — it can't reach Material's
  // own per-component CSS (e.g. `.mat-mdc-raised-button { background-color:
  // var(--mat-button-protected-container-color, var(--mat-sys-surface)) }`),
  // which Material ships as UNLAYERED global CSS via its own component
  // metadata. Per the CSS spec, unlayered styles always beat layered ones
  // regardless of layer order — so a plain `bg-city-primary` class could
  // never win here, no matter how styles.scss ordered its layers. That's
  // a bug this component shipped with, not a new one.
  //
  // The fix: bind the exact CSS custom property each Material button style
  // reads (confirmed against @angular/material/fesm2022/button.mjs, not
  // guessed) directly via [style] on the host. Inline styles always win
  // over any stylesheet, layered or not — and unlike mat.button-overrides()
  // (a static, site-wide SCSS override), this can vary per `variant()`
  // input, which is the whole point of this component.
  private readonly sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  // Same unlayered-CSS-always-wins problem as color (see styleVars below),
  // just for height/font-size instead: .mat-mdc-raised-button and
  // .mat-mdc-outlined-button both ship a fixed `height` and `font-size` via
  // unlayered global CSS, so sizeClasses' `py-*`/`text-*` utilities never
  // actually change a button's rendered size — confirmed against
  // @angular/material/fesm2022/button.mjs. Same fix as color: bind the
  // exact custom property each appearance reads, per size.
  private readonly sizeDimensions: Record<'sm' | 'md' | 'lg', { height: string; fontSize: string }> = {
    sm: { height: '32px', fontSize: '0.875rem' },
    md: { height: '40px', fontSize: '1rem' },
    lg: { height: '48px', fontSize: '1.125rem' },
  };

  classes = computed(() =>
    [
      'rounded-md',
      'cursor-pointer',
      'transition-colors',
      'duration-200',
      'ease-in-out',
      'hover:brightness-110',
      'active:brightness-95',
      'disabled:cursor-not-allowed',
      'disabled:hover:brightness-100',
      this.sizeClasses[this.size()],
      this.length() === 'full' ? 'w-full' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  // Keyed to the exact custom property each appearance's CSS reads:
  // mat-raised-button → .mat-mdc-raised-button (appearance "elevated",
  // tokens button-protected-*); mat-stroked-button → .mat-mdc-outlined-button
  // (appearance "outlined", tokens button-outlined-*).
  styleVars = computed(() => {
    const { height, fontSize } = this.sizeDimensions[this.size()];

    if (this.variant() === 'secondary') {
      return {
        '--mat-button-outlined-label-text-color': 'var(--color-city-primary)',
        '--mat-button-outlined-outline-color': 'var(--color-city-primary)',
        '--mat-button-outlined-container-height': height,
        '--mat-button-outlined-label-text-size': fontSize,
      };
    }
    return {
      '--mat-button-protected-container-color':
        this.variant() === 'destructive' ? 'var(--color-city-red)' : 'var(--color-city-primary)',
      '--mat-button-protected-label-text-color': 'var(--color-city-white)',
      '--mat-button-protected-container-height': height,
      '--mat-button-protected-label-text-size': fontSize,
    };
  });
}
