import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CityDatepicker } from './city-datepicker';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CityDatepicker],
  template: `<city-datepicker [formControl]="control" label="Visit date" />`,
})
class HostComponent {
  control = new FormControl<Date | null>(null);
}

describe('CityDatepicker', () => {
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

  it('writes the FormControl value into the input', () => {
    const date = new Date(2026, 0, 15);
    fixture.componentInstance.control.setValue(date);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.value).toContain('2026');
  });

  it('disables the input when the FormControl is disabled', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.disabled).toBe(true);
  });
});
