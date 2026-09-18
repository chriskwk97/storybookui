import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the nav with links to all four routes', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const links = Array.from(
      fixture.nativeElement.querySelectorAll('nav a'),
    ).map((a) => (a as HTMLAnchorElement).getAttribute('routerLink'));
    expect(links).toEqual([
      '/',
      '/buttons',
      '/closedown',
      '/visitor-sign-in',
      '/architecture',
    ]);
  });
});
