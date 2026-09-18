import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityPageShell } from './city-page-shell';

@Component({
  standalone: true,
  imports: [CityPageShell],
  template: `<city-page-shell><p>Projected content</p></city-page-shell>`,
})
class HostComponent {}

describe('CityPageShell', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('renders projected content inside a <main> with the 3% gutter', () => {
    const main: HTMLElement = fixture.nativeElement.querySelector('main');
    expect(main).toBeTruthy();
    expect(main.className).toContain('px-[3%]');
    expect(main.textContent?.trim()).toBe('Projected content');
  });
});
