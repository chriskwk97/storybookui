import { Injectable } from '@angular/core';
import { of, delay, type Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteApiService {
  // Illustrative only — stands in for a real HTTP call to the site API.
  fetchSiteName(): Observable<string> {
    return of('demo-site').pipe(delay(200));
  }
}
