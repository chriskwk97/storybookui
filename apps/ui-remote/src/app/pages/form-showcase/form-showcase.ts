import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CityButton, CityInput, CitySelect, CitySelectOption } from '@org/ui';

const YES_NO_OPTIONS: CitySelectOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

// Demonstrates the two libs/ui form primitives composed into a real,
// validated form — not just each control shown in isolation. CityInput
// gates its own error display on its own internal `touched` signal (set on
// blur), so the parent only has to compute *what* the error message is, not
// *when* to show it — no touched-state syncing needed across the CVA
// boundary for this.
@Component({
  selector: 'app-form-showcase',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CityInput, CitySelect, CityButton, JsonPipe],
  templateUrl: './form-showcase.html',
  styleUrl: './form-showcase.scss',
})
export class FormShowcase {
  protected readonly yesNoOptions = YES_NO_OPTIONS;

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    returningVisitor: new FormControl<string | null>(null, { validators: [Validators.required] }),
    requiresBadge: new FormControl<string | null>(null, { validators: [Validators.required] }),
  });

  private readonly formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });

  protected readonly nameError = computed(() => {
    this.formValue();
    return this.form.controls.name.hasError('required') ? 'Name is required.' : null;
  });

  protected readonly emailError = computed(() => {
    this.formValue();
    const control = this.form.controls.email;
    if (control.hasError('required')) {
      return 'Email is required.';
    }
    if (control.hasError('email')) {
      return 'Enter a valid email address.';
    }
    return null;
  });

  protected readonly returningVisitorError = computed(() => {
    this.formValue();
    return this.form.controls.returningVisitor.hasError('required')
      ? 'Please select an option.'
      : null;
  });

  protected readonly requiresBadgeError = computed(() => {
    this.formValue();
    return this.form.controls.requiresBadge.hasError('required')
      ? 'Please select an option.'
      : null;
  });

  // Submit stays disabled until the form is valid, so there's no case where
  // a click needs to reveal errors on fields nobody has touched yet.
  protected readonly formInvalid = computed(() => {
    this.formValue();
    return this.form.invalid;
  });

  protected readonly submitted = signal(false);

  protected handleSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.submitted.set(true);
  }
}
