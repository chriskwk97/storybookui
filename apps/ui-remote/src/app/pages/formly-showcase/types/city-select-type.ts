import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { CitySelect, CitySelectOption } from '@org/ui';

interface CitySelectProps extends FormlyFieldProps {
  errorMessage?: string;
  options?: CitySelectOption[];
}

@Component({
  selector: 'formly-city-select',
  standalone: true,
  imports: [ReactiveFormsModule, CitySelect],
  template: `
    <city-select
      [formControl]="formControl"
      [label]="props.label ?? ''"
      [required]="!!props.required"
      [options]="props.options ?? []"
      [errorMessage]="showError ? (props.errorMessage ?? 'Please select an option.') : null"
    />
  `,
})
export class CitySelectFormlyType extends FieldType<FieldTypeConfig<CitySelectProps>> {}
