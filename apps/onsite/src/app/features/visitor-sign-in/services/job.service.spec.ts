import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { JobService } from './job.service';

describe('JobService', () => {
  let service: JobService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with no active job', () => {
    expect(service.activeJob()).toBeNull();
  });

  it('startJob() flips activeJob to the job id after the simulated delay', async () => {
    service.startJob();
    expect(service.activeJob()).toBeNull(); // not yet — the delay hasn't elapsed
    await vi.advanceTimersByTimeAsync(400);
    expect(service.activeJob()).toBe('demo-job-001');
  });
});
