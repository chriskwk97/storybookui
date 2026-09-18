import { ChangeDetectionStrategy, Component, effect, forwardRef, input, viewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { CityFormControlBase } from '../shared/city-form-control-base';

// Angular Material owns the field semantics (label float, focus outline,
// error slot, a11y wiring) — Tailwind only touches layout (width, spacing).
// No `!` prefix anywhere here: styles.scss puts Material's theme in an
// earlier cascade layer than Tailwind's, so utilities win without forcing.
//
// CVA plumbing (value/disabled/touched, writeValue/registerOnChange/etc.)
// lives in CityFormControlBase, shared with CitySelect/CityDatepicker.
@Component({
  selector: 'city-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './city-input.html',
  styleUrl: './city-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CityInput),
      multi: true,
    },
  ],
})
export class CityInput extends CityFormControlBase<string> {
  label = input('');
  placeholder = input('');
  type = input<'text' | 'email' | 'password' | 'number'>('text');
  hint = input<string | null>(null);
  required = input(false);
  // Parent derives this from its own FormControl.errors — kept a plain
  // input rather than pulling in NgControl/MatFormFieldControl, which
  // would buy tighter Material integration at real DI complexity cost.
  // Revisit if a second consumer needs that.
  errorMessage = input<string | null>(null);

  // The inner <input matInput> has no NgControl of its own (our CVA wiring
  // is on this outer component instead) — MatFormField's hint/error switch
  // reads MatInput's own errorState, which stays false forever without one,
  // so mat-error never became visible no matter what showError() said. Sync
  // it by hand from our own already-correct signal.
  private readonly matInput = viewChild.required(MatInput);

  constructor() {
    super('');
    effect(() => {
      this.matInput().errorState = this.showError();
    });
  }

  protected handleInput(rawValue: string): void {
    this.emitChange(rawValue);
  }
}
