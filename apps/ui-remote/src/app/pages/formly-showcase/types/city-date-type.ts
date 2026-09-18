import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { CityDatepicker } from '@org/ui';

interface CityDateProps extends FormlyFieldProps {
  errorMessage?: string;
}

@Component({
  selector: 'formly-city-date',
  standalone: true,
  imports: [ReactiveFormsModule, CityDatepicker],
  template: `
    <city-datepicker
      [formControl]="formControl"
      [label]="props.label ?? ''"
      [placeholder]="props.placeholder ?? ''"
      [required]="!!props.required"
      [errorMessage]="showError ? (props.errorMessage ?? 'Please pick a date.') : null"
    />
  `,
})
export class CityDateFormlyType extends FieldType<FieldTypeConfig<CityDateProps>> {}
