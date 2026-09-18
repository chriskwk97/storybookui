import { initFederation } from '@angular-architects/native-federation';

// See apps/ui-remote/src/main.ts for why this is here — Native Federation
// bundles @angular/core/primitives/signals as its own separate shared
// chunk without the ngDevMode define the main @angular/core chunk gets,
// so any computed()/signal() usage here (ReasonForVisitTable et al.) can
// throw ReferenceError without this.
(globalThis as unknown as { ngDevMode: boolean }).ngDevMode ??= true;

initFederation('federation.manifest.json')
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
