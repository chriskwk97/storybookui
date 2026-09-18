import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReasonForVisitTable } from './reason-for-visit-table';

// The service has a real (short) simulated network delay — this waits
// past it rather than faking timers, keeping the test honest about the
// fact that reasonsResource is genuinely asynchronous.
const flushMockNetwork = () => new Promise((resolve) => setTimeout(resolve, 350));

describe('ReasonForVisitTable', () => {
  let fixture: ComponentFixture<ReasonForVisitTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReasonForVisitTable, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ReasonForVisitTable);
    fixture.detectChanges();
    await flushMockNetwork();
    fixture.detectChanges();
  });

  it('loads and renders the active reasons by default', () => {
    const rows: string = fixture.nativeElement.textContent;
    expect(rows).toContain('Delivery');
    expect(rows).toContain('Contractor works');
    expect(rows).not.toContain('Visitor tour');
  });

  it('switches to inactive reasons when "Active only" is unchecked', async () => {
    const component = fixture.componentInstance as unknown as {
      onActiveOnlyChange: (event: { checked: boolean }) => void;
    };
    component.onActiveOnlyChange({ checked: false });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Visitor tour');
    expect(fixture.nativeElement.textContent).not.toContain('Delivery');
  });
});
