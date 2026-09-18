import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Replaces the real app's openSearch/closeSearch/showSearchButton/
// showSearchInput quartet (visitor-type-management-add-edit.component.ts)
// with one signal-backed component. `query` is a `model()` — a two-way
// signal — so the parent never manages open/close state, only the term.
@Component({
  selector: 'city-search-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './city-search-toggle.html',
  styleUrl: './city-search-toggle.scss',
})
export class CitySearchToggle {
  placeholder = input('Search');
  query = model('');

  protected readonly isOpen = signal(false);

  protected open(): void {
    this.isOpen.set(true);
  }

  protected close(): void {
    this.isOpen.set(false);
    this.query.set('');
  }
}
