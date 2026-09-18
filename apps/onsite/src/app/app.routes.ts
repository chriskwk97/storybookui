import { Route } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { Home } from './pages/home/home';

export const appRoutes: Route[] = [
  {
    path: '',
    title: 'Home',
    component: Home, // eager — fast first paint, this is the landing/nav page
  },
  {
    path: 'buttons',
    title: 'Buttons',
    loadComponent: () =>
      loadRemoteModule('uiRemote', './ButtonsShowcase').then(
        (m) => m.ButtonsShowcase,
      ),
  },
  {
    path: 'closedown',
    title: 'Closedown',
    loadComponent: () =>
      import('./features/closedown/closedown').then((m) => m.Closedown),
  },
  {
    path: 'visitor-sign-in',
    title: 'Visitor sign-in',
    loadComponent: () =>
      import('./features/visitor-sign-in/components/sign-in/sign-in').then(
        (m) => m.SignIn,
      ),
  },
  {
    path: 'architecture',
    title: 'Architecture',
    loadComponent: () =>
      import('./pages/architecture/architecture').then((m) => m.Architecture),
  },
  {
    path: 'visitor-type-management',
    title: 'Visitor type management',
    loadComponent: () =>
      import(
        './features/visitor-type-management/components/reason-for-visit-table/reason-for-visit-table'
      ).then((m) => m.ReasonForVisitTable),
  },
];
