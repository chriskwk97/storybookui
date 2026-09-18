import { initFederation } from '@angular-architects/native-federation';

// Native Federation bundles @angular/core/primitives/signals (where
// computed()/signal() actually live) as its own separate shared chunk,
// and that chunk doesn't receive the same ngDevMode build-time define the
// main @angular/core chunk gets — a known gap (see
// angular-architects/module-federation-plugin#458 and #897), not something
// wrong in our components. Defining it globally, first thing, before any
// federated chunk loads, means every chunk finds it regardless of which
// one runs first.
(globalThis as unknown as { ngDevMode: boolean }).ngDevMode ??= true;

initFederation()
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
