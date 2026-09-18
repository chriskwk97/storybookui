import { ChangeDetectionStrategy, Component, effect, forwardRef, input, viewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { CityFormControlBase } from '../shared/city-form-control-base';

export interface CitySelectOption {
  value: string;
  label: string;
}

// Same shape as CityInput: a real ControlValueAccessor wrapping Material's
// own field (mat-select instead of matInput this time), Tailwind only
// touching layout. `options` is a required input rather than something
// CitySelect looks up itself — the component doesn't know or care where
// the list comes from, hardcoded here today, an API call later if needed.
//
// CVA plumbing lives in CityFormControlBase, shared with CityInput/
// CityDatepicker.
@Component({
  selector: 'city-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './city-select.html',
  styleUrl: './city-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CitySelect),
      multi: true,
    },
  ],
})
export class CitySelect extends CityFormControlBase<string | null> {
  label = input('');
  placeholder = input('');
  required = input(false);
  errorMessage = input<string | null>(null);
  options = input.required<CitySelectOption[]>();

  // Same fix as CityInput: <mat-select> has no NgControl of its own, so
  // MatFormField's hint/error switch (which reads its errorState) never
  // flips to 'error' on its own — sync it from our own showError signal.
  private readonly matSelect = viewChild.required(MatSelect);

  constructor() {
    super(null);
    effect(() => {
      this.matSelect().errorState = this.showError();
    });
  }

  protected handleSelectionChange(value: string): void {
    this.emitChange(value);
  }
}
