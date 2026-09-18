import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityDataTable, CityTableColumn } from './city-data-table';

interface Row {
  id: string;
  description: string;
}

describe('CityDataTable', () => {
  let component: CityDataTable<Row>;
  let fixture: ComponentFixture<CityDataTable<Row>>;

  const columns: CityTableColumn<Row>[] = [
    { key: 'description', header: 'Description', sortable: true, cell: (row) => row.description },
  ];
  const rows: Row[] = [
    { id: '1', description: 'Delivery' },
    { id: '2', description: 'Contractor works' },
    { id: '3', description: 'Site inspection' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityDataTable],
    }).compileComponents();

    fixture = TestBed.createComponent(CityDataTable<Row>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('rows', rows);
    fixture.componentRef.setInput('columns', columns);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the configured header and one row per input', () => {
    fixture.detectChanges();
    const headerText = fixture.nativeElement.querySelector('th');
    expect(headerText.textContent).toContain('Description');
    const cells = fixture.nativeElement.querySelectorAll('td');
    expect(cells[0].textContent).toContain('Delivery');
  });

  it('actually paginates instead of just rendering the paginator', () => {
    fixture.componentRef.setInput('pageSize', 1);
    fixture.detectChanges();

    let cells: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('td');
    expect(cells.length).toBe(1);
    expect(cells[0].textContent).toContain('Delivery');

    component['onPage']({ pageIndex: 1, pageSize: 1, length: rows.length });
    fixture.detectChanges();

    cells = fixture.nativeElement.querySelectorAll('td');
    expect(cells.length).toBe(1);
    expect(cells[0].textContent).toContain('Contractor works');
  });

  it('resets to page one when the underlying rows change', () => {
    fixture.componentRef.setInput('pageSize', 1);
    fixture.detectChanges();

    component['onPage']({ pageIndex: 2, pageSize: 1, length: rows.length });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('td')[0].textContent).toContain(
      'Site inspection',
    );

    fixture.componentRef.setInput('rows', [rows[0]]);
    fixture.detectChanges();

    const cells = fixture.nativeElement.querySelectorAll('td');
    expect(cells.length).toBe(1);
    expect(cells[0].textContent).toContain('Delivery');
  });
});
