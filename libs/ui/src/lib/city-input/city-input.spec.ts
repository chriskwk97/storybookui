import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CityInput } from './city-input';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CityInput],
  template: `<city-input [formControl]="control" label="Email" />`,
})
class HostComponent {
  control = new FormControl('');
}

describe('CityInput', () => {
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
    fixture.componentInstance.control.setValue('chris@example.com');
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('chris@example.com');
  });

  it('propagates input changes back to the FormControl', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'new value';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe('new value');
  });

  it('disables the input when the FormControl is disabled', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.disabled).toBe(true);
  });
});
