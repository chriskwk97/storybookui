import { ChangeDetectionStrategy, Component } from '@angular/core';

// The one place the 3% main-content gutter (per the ui-layout reference)
// lives — every consuming app wraps its content in this instead of
// hand-writing `px-[3%]` per app. A percentage gutter needs no separate
// mobile/desktop rule; it scales with viewport width on its own.
// Nav bar / footer slots intentionally left out until there's real content
// to put in them — the reference layout has them, this doesn't yet.
@Component({
  selector: 'city-page-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './city-page-shell.html',
  styleUrl: './city-page-shell.scss',
})
export class CityPageShell {}
