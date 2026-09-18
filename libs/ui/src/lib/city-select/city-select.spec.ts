import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CitySelect, CitySelectOption } from './city-select';

const YES_NO: CitySelectOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CitySelect],
  template: `<city-select [formControl]="control" label="Returning visitor?" [options]="options" />`,
})
class HostComponent {
  control = new FormControl<string | null>(null);
  options = YES_NO;
}

describe('CitySelect', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('writes the FormControl value into the select', () => {
    fixture.componentInstance.control.setValue('yes');
    fixture.detectChanges();
    const select = fixture.debugElement.query((d) => d.name === 'mat-select');
    expect(select.componentInstance.value).toBe('yes');
  });

  it('propagates a selection back to the FormControl', () => {
    const selectInstance = fixture.debugElement.query(
      (d) => d.name === 'mat-select',
    ).componentInstance;
    selectInstance.value = 'no';
    selectInstance.selectionChange.emit({ value: 'no' });
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe('no');
  });

  it('disables the select when the FormControl is disabled', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    const select = fixture.debugElement.query((d) => d.name === 'mat-select');
    expect(select.componentInstance.disabled).toBe(true);
  });
});
