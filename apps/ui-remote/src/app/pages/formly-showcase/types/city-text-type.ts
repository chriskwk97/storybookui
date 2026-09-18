import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { CityInput } from '@org/ui';

interface CityTextProps extends FormlyFieldProps {
  errorMessage?: string;
}

// Bridges Formly's field-config world to our own design system: Formly
// hands this component a formControl + props, it renders a real CityInput
// with them — the config never touches Angular Material or Tailwind
// directly, it just describes "a text field," and this decides how City
// renders one.
@Component({
  selector: 'formly-city-text',
  standalone: true,
  imports: [ReactiveFormsModule, CityInput],
  template: `
    <city-input
      [formControl]="formControl"
      [label]="props.label ?? ''"
      [placeholder]="props.placeholder ?? ''"
      [required]="!!props.required"
      [errorMessage]="showError ? (props.errorMessage ?? 'This field is required.') : null"
    />
  `,
})
export class CityTextFormlyType extends FieldType<FieldTypeConfig<CityTextProps>> {}
