import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityButton } from './city-button';

@Component({
  standalone: true,
  imports: [CityButton],
  template: `<city-button [variant]="variant">Continue</city-button>`,
})
class HostComponent {
  variant: 'primary' | 'secondary' | 'destructive' = 'primary';
}

describe('CityButton', () => {
  let component: CityButton;
  let fixture: ComponentFixture<CityButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityButton],
    }).compileComponents();

    fixture = TestBed.createComponent(CityButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a raised button with the primary container color by default', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.hasAttribute('mat-raised-button')).toBe(true);
    expect(button.style.getPropertyValue('--mat-button-protected-container-color')).toBe(
      'var(--color-city-primary)',
    );
  });

  it('renders a stroked button for the secondary variant', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.hasAttribute('mat-stroked-button')).toBe(true);
    expect(button.style.getPropertyValue('--mat-button-outlined-label-text-color')).toBe(
      'var(--color-city-primary)',
    );
  });

  it('renders destructive color for the destructive variant', () => {
    fixture.componentRef.setInput('variant', 'destructive');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.style.getPropertyValue('--mat-button-protected-container-color')).toBe(
      'var(--color-city-red)',
    );
  });

  it('binds container height and font size per size, since Material overrides them unlayered otherwise', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.style.getPropertyValue('--mat-button-protected-container-height')).toBe('48px');
    expect(button.style.getPropertyValue('--mat-button-protected-label-text-size')).toBe('1.125rem');
  });

  it('binds the outlined size variables for the secondary variant', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.style.getPropertyValue('--mat-button-outlined-container-height')).toBe('32px');
    expect(button.style.getPropertyValue('--mat-button-outlined-label-text-size')).toBe('0.875rem');
  });

  it('applies the full-width class when length is full', () => {
    fixture.componentRef.setInput('length', 'full');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.className).toContain('w-full');
  });

  it('propagates the disabled input to the underlying button', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });
});

// Separate from the suite above: exercises real content projection through
// a host template, the way every actual consumer uses this component.
// Regression coverage for a documented Angular bug (angular/angular#53310)
// where <ng-content> silently renders empty specifically inside an @if
// branch — the unit tests above never caught it because they instantiate
// CityButton directly, with no projected content to lose in the first place.
describe('CityButton content projection', () => {
  let hostFixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(HostComponent);
  });

  it('renders projected content for the primary (raised) variant', () => {
    hostFixture.componentInstance.variant = 'primary';
    hostFixture.detectChanges();
    const button = hostFixture.nativeElement.querySelector('button');
    expect(button.textContent.trim()).toBe('Continue');
  });

  it('renders projected content for the secondary (stroked) variant', () => {
    hostFixture.componentInstance.variant = 'secondary';
    hostFixture.detectChanges();
    const button = hostFixture.nativeElement.querySelector('button');
    expect(button.textContent.trim()).toBe('Continue');
  });

  it('renders projected content for the destructive variant', () => {
    hostFixture.componentInstance.variant = 'destructive';
    hostFixture.detectChanges();
    const button = hostFixture.nativeElement.querySelector('button');
    expect(button.textContent.trim()).toBe('Continue');
  });
});
