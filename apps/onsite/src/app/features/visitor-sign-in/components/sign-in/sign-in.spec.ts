import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { SignIn } from './sign-in';
import { JobService } from '../../services/job.service';

describe('SignIn', () => {
  let component: SignIn;
  let fixture: ComponentFixture<SignIn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignIn],
    }).compileComponents();

    fixture = TestBed.createComponent(SignIn);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the welcome copy and sign-in button', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Welcome');
    expect(compiled.querySelector('city-button')).toBeTruthy();
  });

  it('submitting sign-in calls the job service and shows the active job after the delay', async () => {
    vi.useFakeTimers();
    try {
      fixture.detectChanges();
      const service = TestBed.inject(JobService);

      component.onSignIn();
      fixture.detectChanges();
      let compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).not.toContain('Active job:');

      await vi.advanceTimersByTimeAsync(400);
      fixture.detectChanges();
      compiled = fixture.nativeElement as HTMLElement;
      expect(service.activeJob()).toBe('demo-job-001');
      expect(compiled.textContent).toContain('Active job: demo-job-001');
    } finally {
      vi.useRealTimers();
    }
  });
});
