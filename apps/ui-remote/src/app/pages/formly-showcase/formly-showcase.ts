import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm, provideFormlyCore } from '@ngx-formly/core';
import { CityButton } from '@org/ui';
import { CityDateFormlyType } from './types/city-date-type';
import { CitySelectFormlyType } from './types/city-select-type';
import { CityTextFormlyType } from './types/city-text-type';

@Component({
  selector: 'app-formly-showcase',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormlyForm, CityButton, JsonPipe],
  templateUrl: './formly-showcase.html',
  styleUrl: './formly-showcase.scss',
  providers: [
    provideFormlyCore([
      {
        types: [
          { name: 'city-text', component: CityTextFormlyType },
          { name: 'city-select', component: CitySelectFormlyType },
          { name: 'city-date', component: CityDateFormlyType },
        ],
      },
    ]),
  ],
})
export class FormlyShowcase {
  private readonly http = inject(HttpClient);

  protected readonly form = new FormGroup({});

  protected readonly model = {
    fullName: '',
    role: null,
    company: null,
    startDate: null,
  };

  // Real JSON on disk (apps/ui-remote/public/formly-config.json), fetched
  // at runtime — null while loading. Formly's `type` strings resolve
  // against the registry above, so the JSON never needs to name a
  // component, only a key the registry already knows.
protected readonly fields = toSignal(this.http.get<FormlyFieldConfig[]>('formly-config.json'), {
    initialValue: null,
  });

  private readonly formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  protected readonly formInvalid = computed(() => {
    this.formStatus();
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
