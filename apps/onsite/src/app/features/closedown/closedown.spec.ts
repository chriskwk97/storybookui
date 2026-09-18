import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Closedown } from './closedown';
import { ClosedownService } from './closedown.service';

describe('Closedown', () => {
  let component: Closedown;
  let fixture: ComponentFixture<Closedown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Closedown],
    }).compileComponents();

    fixture = TestBed.createComponent(Closedown);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the confirm screen before closedown is confirmed', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Close down session');
  });

  it('confirming closedown calls the service and flips the template branch', () => {
    fixture.detectChanges();
    const service = TestBed.inject(ClosedownService);
    component.onConfirm();
    fixture.detectChanges();
    expect(service.closed()).toBe(true);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Session closed.');
  });
});
