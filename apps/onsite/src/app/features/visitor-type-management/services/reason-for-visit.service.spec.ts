import { firstValueFrom } from 'rxjs';
import { ReasonForVisitService } from './reason-for-visit.service';

describe('ReasonForVisitService', () => {
  let service: ReasonForVisitService;

  beforeEach(() => {
    service = new ReasonForVisitService();
  });

  it('returns the seeded reasons for a visitor type', async () => {
    const reasons = await firstValueFrom(
      service.getVisitReasonsByVisitorTypeId('demo-visitor-type-1'),
    );
    expect(reasons.length).toBe(4);
    expect(reasons.map((reason) => reason.description)).toContain('Delivery');
  });

  it('adds a new reason and makes it visible on the next fetch', async () => {
    await firstValueFrom(service.addVisitReason('Emergency callout'));
    const reasons = await firstValueFrom(
      service.getVisitReasonsByVisitorTypeId('demo-visitor-type-1'),
    );
    expect(reasons.some((reason) => reason.description === 'Emergency callout')).toBe(true);
  });
});
