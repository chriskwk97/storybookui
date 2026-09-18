import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { SiteService } from './site.service';

export const siteGuard: CanActivateFn = () => !!inject(SiteService).currentSite();
