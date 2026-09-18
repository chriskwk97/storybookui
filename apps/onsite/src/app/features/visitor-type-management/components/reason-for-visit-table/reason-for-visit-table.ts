import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { Sort } from '@angular/material/sort';
import { CityDataTable, CitySearchToggle, CityTableColumn } from '@org/ui';
import { ReasonForVisitService } from '../../services/reason-for-visit.service';
import { VisitReason } from '../../models/visit-reason.model';
import { ReasonForVisitAddDialog } from '../reason-for-visit-add-dialog/reason-for-visit-add-dialog';

// The signals-only counterpart to the real app's
// visitor-type-management-add-edit.component.ts (14 raw .subscribe() calls,
// zero teardown). Everything here is resource()/computed()/toSignal() —
// zero manual .subscribe(), zero ngOnDestroy needed, because nothing is
// manually torn down: Angular owns every subscription's lifecycle.
@Component({
  selector: 'app-reason-for-visit-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CityDataTable, CitySearchToggle, MatButtonModule, MatIconModule, MatCheckboxModule],
  templateUrl: './reason-for-visit-table.html',
  styleUrl: './reason-for-visit-table.scss',
})
export class ReasonForVisitTable {
  private readonly reasonService = inject(ReasonForVisitService);
  private readonly dialog = inject(MatDialog);

  // Stands in for the real app's route param (`selectedVisitorTypeId`) —
  // fixed here since this demo isn't wired to a real visitor-type record.
  private readonly visitorTypeId = signal('demo-visitor-type-1');

  protected readonly searchTerm = signal('');
  protected readonly isActiveOnly = signal(true);
  protected readonly sortState = signal<Sort>({ active: '', direction: '' });

  // The one deliberate RxJS bridge: debounce has no signal-native
  // equivalent yet, so this is where RxJS still earns its keep. Everything
  // downstream of this reads a plain signal.
  private readonly debouncedSearch = toSignal(
    toObservable(this.searchTerm).pipe(debounceTime(500), distinctUntilChanged()),
    { initialValue: '' },
  );

  protected readonly reasonsResource = resource({
    params: () => this.visitorTypeId(),
    defaultValue: [] as VisitReason[],
    loader: ({ params }) =>
      firstValueFrom(this.reasonService.getVisitReasonsByVisitorTypeId(params)),
  });

  protected readonly filteredReasons = computed(() => {
    const term = this.debouncedSearch().toLowerCase();
    const activeOnly = this.isActiveOnly();
    return this.reasonsResource.value().filter(
      (reason: VisitReason) =>
        reason.description.toLowerCase().includes(term) && reason.isActive === activeOnly,
    );
  });

  // City-data-table only sorts the headers; the actual reorder is
  // data-specific, so it's a computed() here, not inside the lib component.
  protected readonly sortedReasons = computed(() => {
    const rows = this.filteredReasons();
    const { active, direction } = this.sortState();
    if (!active || !direction) return rows;
    const dir = direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => dir * a.description.localeCompare(b.description));
  });

  protected readonly columns: CityTableColumn<VisitReason>[] = [
    { key: 'description', header: 'Description', sortable: true, cell: (reason) => reason.description },
    { key: 'isActive', header: 'Active', cell: (reason) => (reason.isActive ? 'Yes' : 'No') },
  ];

  protected onSortChange(sort: Sort): void {
    this.sortState.set(sort);
  }

  protected onActiveOnlyChange(event: MatCheckboxChange): void {
    this.isActiveOnly.set(event.checked);
  }

  protected async openAddDialog(): Promise<void> {
    const ref = this.dialog.open(ReasonForVisitAddDialog);
    const description = await firstValueFrom(ref.afterClosed()); // await, not .subscribe()
    if (description) {
      const created = await firstValueFrom(this.reasonService.addVisitReason(description));
      // Optimistic update — we already have the created row, so append it
      // locally instead of paying for a full reload() round-trip of data
      // we already know.
      this.reasonsResource.update((current) => [...current, created]);
    }
  }
}
