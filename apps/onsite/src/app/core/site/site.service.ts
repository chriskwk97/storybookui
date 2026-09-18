import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SiteService {
  private readonly _currentSite = signal('demo-site');
  readonly currentSite = this._currentSite.asReadonly();
}
