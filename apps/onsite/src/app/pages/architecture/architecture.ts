import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

// Sourced from City Onsite UI's docs/architecture/folder-restructuring.md —
// AFTER is the doc's own "Target structure" (condensed); BEFORE is
// reconstructed from the real folder names the doc names as examples of
// the current flat layout (organizational metadata, not proprietary UI).
const BEFORE = `src/app/components/  (51 flat sibling folders, alphabetical, no grouping)
  open-permit/
  close-permit/
  permit-question-render/
  permit-welfare-checks/
  sign-in/
  qr-sign-in/
  site-sign-in/
  login-user/
  login-password/
  logout/
  admin-management-add-edit/
  site-management-edit/
  user-profile/
  closedown/
  release-note/
  dialog/
  loader/
  ...(37 more, same flat list)

src/app/services/  (25 flat sibling folders, same problem)
  permit/
  site/
  job/
  user/
  auth/
  ...(20 more)`;

const AFTER = `src/app/
  core/                # app-wide singletons — one instance, used everywhere
    auth/
    http/
    native/
    config/
    user/
    monitoring/

  shared/              # reusable, dumb, no feature owns them
    components/        # dialog, loader, internationalization
    pipes/
    validators/
    util/

  features/
    auth/              # login-user, login-password, logout, register...
    visitor-sign-in/   # sign-in, qr-sign-in, site-sign-in, ...
    induction/
    permit/            # open-permit, close-permit, permit-question-render, ...
    admin/
    user-account/
    closedown/
    release-note/

  models/
  app.component.*, app.module.ts, app-routing.module.ts   # the shell`;

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './architecture.html',
  styleUrl: './architecture.scss',
})
export class Architecture {
  protected readonly before = BEFORE;
  protected readonly after = AFTER;
}
