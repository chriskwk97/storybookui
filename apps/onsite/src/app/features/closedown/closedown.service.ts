import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ClosedownService {
  private readonly _closed = signal(false);
  readonly closed = this._closed.asReadonly();

  confirmClosedown(): void {
    this._closed.set(true);
  }

  reset(): void {
    this._closed.set(false);
  }
}
