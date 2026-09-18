import { ChangeDetectionStrategy, Component, effect, forwardRef, input, viewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { CityFormControlBase } from '../shared/city-form-control-base';

// Same CVA shape as CityInput/CitySelect, wrapping mat-datepicker this time.
// `provideNativeDateAdapter()` is scoped to this component's own providers
// rather than an app's config — a consumer that drops in <city-datepicker>
// shouldn't also have to remember to register a date adapter for it.
//
// CVA plumbing lives in CityFormControlBase, shared with CityInput/
// CitySelect.
@Component({
  selector: 'city-datepicker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './city-datepicker.html',
  styleUrl: './city-datepicker.scss',
  providers: [
    provideNativeDateAdapter(),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CityDatepicker),
      multi: true,
    },
  ],
})
export class CityDatepicker extends CityFormControlBase<Date | null> {
  label = input('');
  placeholder = input('');
  required = input(false);
  errorMessage = input<string | null>(null);

  // Same fix as CityInput: the inner <input matInput> has no NgControl of
  // its own, so MatFormField's hint/error switch (which reads its
  // errorState) never flips to 'error' on its own — sync it by hand.
  private readonly matInput = viewChild.required(MatInput);

  constructor() {
    super(null);
    effect(() => {
      this.matInput().errorState = this.showError();
    });
  }

  protected handleDateChange(value: Date | null): void {
    this.emitChange(value);
  }
}
