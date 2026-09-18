import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { VisitReason } from '../models/visit-reason.model';

const INITIAL_REASONS: VisitReason[] = [
  { id: '1', description: 'Delivery', isActive: true },
  { id: '2', description: 'Contractor works', isActive: true },
  { id: '3', description: 'Site inspection', isActive: true },
  { id: '4', description: 'Visitor tour', isActive: false },
];

// Observable-returning, same shape as the real ReferenceService — the
// resource()/firstValueFrom bridge in ReasonForVisitTable is proven against
// a realistic HTTP-shaped API, not a Promise-only mock invented for the demo.
@Injectable({ providedIn: 'root' })
export class ReasonForVisitService {
  private reasons: VisitReason[] = [...INITIAL_REASONS];

  // visitorTypeId is unused here (this demo only ever seeds one visitor
  // type) but kept in the signature — it's what resource()'s request
  // signal actually passes through in ReasonForVisitTable, and it matches
  // the real ReferenceService's method shape.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getVisitReasonsByVisitorTypeId(visitorTypeId: string): Observable<VisitReason[]> {
    return of(this.reasons).pipe(delay(300));
  }

  addVisitReason(description: string): Observable<VisitReason> {
    const created: VisitReason = {
      id: crypto.randomUUID(),
      description,
      isActive: true,
    };
    this.reasons = [...this.reasons, created];
    return of(created).pipe(delay(300));
  }
}
