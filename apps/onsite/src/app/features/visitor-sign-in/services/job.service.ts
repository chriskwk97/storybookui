// RxJS handles the (simulated) async operation; the Signal is what the
// template actually reads — RxJS for handling, signals for sending
// what's important to the view.
import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, switchMap, of, delay, startWith } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly startJob$ = new Subject<void>();

  readonly activeJob = toSignal(
    this.startJob$.pipe(
      switchMap(() => of('demo-job-001').pipe(delay(400))), // simulated network latency
      startWith(null as string | null),
    ),
    { initialValue: null },
  );

  startJob(): void {
    this.startJob$.next();
  }
}
