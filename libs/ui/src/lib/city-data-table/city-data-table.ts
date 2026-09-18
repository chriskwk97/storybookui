import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface CityTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => string;
  sortable?: boolean;
}

// Presentational only — sorts the *headers*, never the rows. The actual
// sort comparator is data-specific and stays with whoever owns the dataset;
// this component only surfaces the sort UI and reports what was clicked,
// the same division of labour Material's own matSort directive uses.
// Pagination, by contrast, is generic — genuinely owned here.
@Component({
  selector: 'city-data-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './city-data-table.html',
  styleUrl: './city-data-table.scss',
})
export class CityDataTable<T extends { id: string | number }> {
  rows = input.required<T[]>();
  columns = input.required<CityTableColumn<T>[]>();
  pageSize = input(10);
  pageSizeOptions = input<number[]>([10, 20, 50]);

  sortChange = output<Sort>();

  protected readonly pageIndex = signal(0);
  protected readonly currentPageSize = signal(this.pageSize());

  protected readonly displayedColumns = computed(() => this.columns().map((c) => c.key));

  protected readonly pagedRows = computed(() => {
    const all = this.rows();
    const size = this.currentPageSize();
    const start = this.pageIndex() * size;
    return all.slice(start, start + size);
  });

  constructor() {
    // A new page size from the parent replaces whatever the paginator UI
    // had picked locally.
    effect(() => this.currentPageSize.set(this.pageSize()));

    // Any change to the underlying rows (new search term, filter, sort)
    // means the previous page index may no longer point at anything —
    // land back on page one rather than showing an empty page.
    effect(() => {
      this.rows();
      this.pageIndex.set(0);
    });
  }

  // Rows have an id, so that's what identifies them — no need for a
  // configurable trackBy until a second consumer actually needs one.
  protected trackByRow(index: number, row: T): string | number {
    return row.id;
  }

  protected onSort(sort: Sort): void {
    this.sortChange.emit(sort);
  }

  protected onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.currentPageSize.set(event.pageSize);
  }
}
