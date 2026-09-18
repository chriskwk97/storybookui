import { TestBed } from '@angular/core/testing';
import { ClosedownService } from './closedown.service';

describe('ClosedownService', () => {
  let service: ClosedownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClosedownService);
  });

  it('starts not closed', () => {
    expect(service.closed()).toBe(false);
  });

  it('confirmClosedown() flips closed to true', () => {
    service.confirmClosedown();
    expect(service.closed()).toBe(true);
  });

  it('reset() flips closed back to false', () => {
    service.confirmClosedown();
    service.reset();
    expect(service.closed()).toBe(false);
  });
});
