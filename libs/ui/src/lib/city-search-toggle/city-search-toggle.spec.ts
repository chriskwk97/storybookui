import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitySearchToggle } from './city-search-toggle';

describe('CitySearchToggle', () => {
  let component: CitySearchToggle;
  let fixture: ComponentFixture<CitySearchToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitySearchToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(CitySearchToggle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('starts closed, showing only the search button', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input')).toBeNull();
    expect(fixture.nativeElement.querySelector('button[mat-fab]')).toBeTruthy();
  });

  it('opens the input on click and reports typed text via the query model', () => {
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button[mat-fab]').click();
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input).toBeTruthy();

    input.value = 'delivery';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.query()).toBe('delivery');
  });

  it('clears the query and closes when the close button is pressed', () => {
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button[mat-fab]').click();
    fixture.detectChanges();

    fixture.nativeElement.querySelector('input').value = 'delivery';
    fixture.nativeElement.querySelector('input').dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button[matSuffix]').click();
    fixture.detectChanges();

    expect(component.query()).toBe('');
    expect(fixture.nativeElement.querySelector('input')).toBeNull();
  });
});
