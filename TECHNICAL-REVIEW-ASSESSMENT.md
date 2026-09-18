> Copied here for presentation, alongside `PROPOSAL.md`. Canonical version lives in
> the real app's repo at `City Onsite UI\docs\architecture\technical-review-assessment.md`,
> cross-linked from its `frontend-modernization-summary.md` — that's the one to keep
> updating if this doc changes. Relative links below point to that repo's structure,
> not this one.

# Technical Review & Assessment — City Onsite Front-End

Status: **draft — prepared for review, not yet approved**
Owner: Frontend engineering
Related: [`frontend-modernization-summary.md`](../City%20Onsite%20UI/docs/frontend-modernization-summary.md), [`design-tokens.md`](../City%20Onsite%20UI/docs/architecture/design-tokens.md), [`folder-restructuring.md`](../City%20Onsite%20UI/docs/architecture/folder-restructuring.md), [`nx-monorepo-and-component-library.md`](../City%20Onsite%20UI/docs/architecture/nx-monorepo-and-component-library.md), [`roadmap-and-sequencing.md`](../City%20Onsite%20UI/docs/architecture/roadmap-and-sequencing.md)

## 1. Overview

This document answers a tech-lead-assigned PBI: a technical review of the City Onsite
Front-End covering architecture, performance, templates, best practices, security,
accessibility, dependency management, and testing — produced against the team's
Definition of Done and a five-scenario acceptance-criteria template.

The five docs listed above already cover module organization, folder structure, design
tokens, and sequencing in detail — none of that is repeated here. This document covers
what those docs don't: **performance**, **accessibility**, **front-end security**, and
**dependency management**, plus one open sub-point inside architecture — **state
management**.

Every finding below is grounded in a direct read of the real repository — grep counts and
file:line references, not inference (full file list in [Section 8](#8-sources--appendix)).
Nothing in the application has been changed as part of producing this document. This POC
workspace (`onsite-ui-testing`) is where the P1 performance/signals recommendation below
was proven live — see `apps/onsite/src/app/features/visitor-type-management/`.

## 2. Findings & Observations

### 2.1 Architectural consistency (Scenario 1)

Module organization, folder structure, service layering, and reusability are already
fully documented in `nx-monorepo-and-component-library.md` and `folder-restructuring.md`.
One sub-point was open: state management.

**Finding — state is RxJS-only; no NgRx, no Signals.** Despite running Angular 21, a
search for `signal(`, `computed(`, `toSignal(`, and `ngrx` across `src/app` returns zero
hits. State instead lives in ad-hoc `Subject`/`BehaviorSubject` singletons on
root-provided services:
- `services/loader/loader.service.ts` — two bare `Subject<boolean>` (`isLoading`,
  `isPageLoading`); being a plain `Subject` rather than `BehaviorSubject`, late
  subscribers miss whatever the current value already is.
- `services/navigation/navigation.service.ts` — a `Subject`-based message bus driving
  header/menu behavior app-wide.
- `services/auth/auth.service.ts:34` — a private, mutable `BehaviorSubject<boolean>`
  exposed as `.asObservable()`.

It's a working pattern, but an informal one — no single source of truth, no selectors,
no immutability guarantee. Not urgent, but worth naming as architecture debt.

### 2.2 Performance (Scenario 2)

Not previously covered by any existing doc.

| Finding | Evidence |
|---|---|
| Zero components use `OnPush` | 0 of 74 `@Component` classes set `ChangeDetectionStrategy.OnPush` — every screen runs full-tree, Zone.js-driven change detection. |
| 196 unmanaged subscriptions in production code | Against only 6 `takeUntil`, 0 `takeUntilDestroyed`, and 11 `ngOnDestroy` implementations total. Worst case: `components/visitor-type-management-add-edit/visitor-type-management-add-edit.component.ts` — 14 raw `.subscribe()` calls, zero teardown of any kind, a 700-line legacy `standalone: false` component. |
| Zero lazy-loaded routes | `app-routing.module.ts` is a single flat table, 43 entries, all eager. `loadChildren`/`loadComponent`: 0 occurrences anywhere in the codebase. |
| Bundle budgets configured too loose to matter | `angular.json` sets 5 MB warning / 10 MB error — several times looser than Angular CLI defaults; unlikely to ever fire on a real regression. |
| ✅ `@for`/`track` migration is already complete | Zero `*ngFor` remain; all 34 `@for` blocks sampled include a `track` expression. **Not a gap** — stated here so it isn't mistaken for one. |
| API overfetching/overposting on the visitor-type save path | `services/reference/reference.service.ts` — `getBrands()`/`getAllDomains()` return the full `Brand`/`Domain` models, including `Brand.sites: Site[]` and `Domain.logoutURL`, just to populate two dropdown labels. `updateVisitorType()`/`addVisitorType()` then PUT/POST that same full nested object straight back (`models/visitortype.model.ts` types `brand?: Brand` directly, not an id reference), when the API almost certainly only needs a `brandId`/`domainId`. |

### 2.3 Template, UI & accessibility (Scenario 3)

Button/color drift (52 hand-rolled buttons, 13 stray hex values) is already documented in
`design-tokens.md`. Accessibility and the finding below had not been reviewed until now.

**Finding — near-zero deliberate accessibility investment.** 8 `aria-*` attributes total
across every template (7 `aria-label`, 1 `aria-labelledby`). Zero `role=`. Of 30 `<img>`
tags, 20 have no `alt` — including the sign-in logo. Zero `tabindex`, zero programmatic
`.focus()` calls. `@angular-eslint/template/recommended` bundles a handful of baseline
a11y warnings, but no lint step runs in CI at all, so even those free warnings never
surface.

**Finding — duplicated markup, carrying duplicated inline styling with it.** The "Reason
for Visit" and "Upload Reason" tables in `visitor-type-management-add-edit.component.html`
are near-identical `mat-table`/sort/paginator/search-toggle blocks, repeated verbatim —
including the same inline `style="margin-right: 1em; width: 4em"` attributes on each
copy. **Proven fixed in this POC** — `libs/ui`'s `CityDataTable`/`CitySearchToggle`
consolidate both blocks into one reusable pair, removing the duplicated inline styling as
a side effect.

### 2.4 Best-practices alignment (Scenario 4)

Angular Style Guide compliance and DRY violations (the 52-button/13-color findings) are
already covered in existing docs. Security, dependency management, and one SOLID finding
are new.

**Security:**
- ✅ Token storage is solid — auth tokens live in Capacitor `Preferences`, the correct
  cross-platform choice, not raw browser storage. No hardcoded secrets found anywhere in
  `src/app` or `src/environments`.
- One real, narrow XSS vector — `release-note.component.html:45` binds `[innerHTML]`
  through a `safe` pipe that calls `bypassSecurityTrustHtml` directly on backend-supplied
  HTML, a genuine stored-XSS surface if that content source is ever compromised.
- Sloppy interceptor error handling — `cores/http-interceptor.ts:38` triggers
  `alert(JSON.stringify(event))` on any failed request, exposing raw response bodies to
  the user. 401 handling is a literal `// TODO` — no forced logout, no refresh.

**SOLID / Clean Code:**
- `visitor-type-management-add-edit.component.ts` (700 lines) is the clearest Single
  Responsibility violation in the codebase — one component handling form editing for the
  visitor type itself, two independent tables' search/sort/filter/pagination, and two
  dialog flows.
- `REASON_VISIT`/`UPLOAD_REASON` are string-literal type discriminators instead of a
  union type or enum — minor, easy fix.

**Dependency management:**
- 82 total dependencies (54 `dependencies`, 28 `devDependencies`).
- Three parallel styling systems shipped together: `@angular/material`, `bootstrap`,
  `tailwindcss`.
- Three overlapping auth libraries: `@auth0/angular-jwt`, `@azure/msal-angular`/`msal-browser`,
  `@capacitor-community/generic-oauth2`.
- `@angular-eslint` (pinned `19.2.1`) and the CI-pinned Angular CLI (`Build/RunTests.yaml`)
  both sit two majors behind the `^21.2.5` core — real version drift in the pipeline
  itself.
- `@ngbracket/ngx-layout` — the discontinued library already flagged in
  `nx-monorepo-and-component-library.md` — confirmed still load-bearing, actively used
  (`fxLayout`/`fxFlex`/etc.) across 52 template files.
- **Snyk scanning is disabled on the production pipeline.** A real `.snyk` policy and
  `Snyk_Scan` stage exist and run live in `build-onsite-ui-dev.yml`, `-tst.yml`, and
  `-uat.yml`. In `build-onsite-ui-dmo-prd.yml`, the entire stage is commented out. The
  Definition of Done requires a clean Snyk pass with zero Critical/High findings before
  anything is done — that requirement is currently unenforced on the one pipeline that
  ships to production.

## 3. Risks & Impact Assessment

| Finding | Risk | Impact | Likelihood |
|---|---|---|---|
| Snyk disabled on prod pipeline | Critical/High vulnerabilities ship undetected | High | Active today |
| 196 unmanaged subscriptions, 0% `OnPush` | Memory leaks, sluggish nav on repeat-visit screens | High | Realized — confirmed in the worst-offender component |
| Near-zero accessibility | Compliance/legal exposure; excludes real users | High | Certain — public-facing app |
| Zero lazy loading, 43 eager routes | Slower first paint, especially on mobile/Capacitor | Medium–high | Structural, certain |
| Duplicated markup + inline styling | Two places to fix every future table tweak; drift between them over time | Low–medium | Certain |
| API overfetch/overpost on visitor-type save | Unnecessary payload size; UI save contract coupled to backend's full entity shape | Low–medium | Certain |
| Dependency duplication (styling/auth) | Bundle bloat, onboarding confusion, maintenance drag | Medium | Certain |
| Loose bundle budgets | Regressions ship without warning | Medium | Certain |
| `release-note` XSS bypass | Stored XSS if content source is compromised | Medium | Low–medium, bounded by content trust |
| Tooling version drift (eslint/CLI) | Inconsistent lint behavior between CI and local | Low–medium | Certain |

## 4. Recommended Improvements

Each recommendation follows the PBI's required format: issue, current-implementation
observation, recommended solution, benefit, and a reference to an industry standard.

### P0 — Re-enable Snyk scanning on the production pipeline

- **Issue:** the `Snyk_Scan` stage is commented out in `build-onsite-ui-dmo-prd.yml`
  while active in dev/tst/uat.
- **Observation:** confirmed by direct read of all four pipeline YAML files; dmo-prd's
  block is fully `#`-commented.
- **Recommendation:** restore the stage to match dev/tst/uat exactly; treat as a
  same-week fix, not a roadmap item.
- **Benefit:** closes an active Definition-of-Done violation on the only pipeline that
  ships to real users.
- **Reference:** team Definition of Done — Snyk Integration; [OWASP Dependency-Check /
  SCA guidance](https://owasp.org/www-project-dependency-check/).

### P1 — Adopt OnPush and managed subscriptions, incrementally

- **Issue:** 0/74 components on `OnPush`; 196 raw subscriptions against 0
  `takeUntilDestroyed`.
- **Observation:** `visitor-type-management-add-edit.component.ts` — 14 subscriptions, no
  teardown.
- **Recommendation:** convert component-by-component, highest-traffic screens first;
  pair every subscription with `takeUntilDestroyed()`.
- **Benefit:** removes a confirmed leak risk; cuts re-render cost app-wide.
- **Proven here:** `apps/onsite/src/app/features/visitor-type-management/` — a
  zoneless, signals-only rebuild of exactly this component's worst pattern, zero manual
  `.subscribe()`.
- **Reference:** [angular.dev — Skipping component subtrees
  (OnPush)](https://angular.dev/best-practices/skipping-subtrees); [angular.dev —
  takeUntilDestroyed](https://angular.dev/api/core/rxjs-interop/takeUntilDestroyed).

### P1 — Lazy-load admin/management routes

- **Issue:** 43 routes, all eager; 0 `loadChildren`/`loadComponent` anywhere.
- **Observation:** admin screens gated by `UserAdminGuard` ship in the same bundle as
  the visitor sign-in flow every user actually hits.
- **Recommendation:** convert admin/management routes to `loadComponent`; tighten
  bundle budgets so regressions are actually caught.
- **Benefit:** smaller initial bundle, faster first paint on mobile/Capacitor.
- **Proven here:** every feature route in this workspace (`/closedown`,
  `/visitor-sign-in`, `/visitor-type-management`) is `loadComponent`-lazy; production
  build output shows each getting its own chunk.
- **Reference:** [angular.dev — Lazy loading standalone
  components](https://angular.dev/guide/ssr); [web.dev — Reduce JS payloads with
  code-splitting](https://web.dev/articles/reduce-javascript-payloads-with-code-splitting).

### P1 — Close the accessibility gap

- **Issue:** 8 `aria-*` total, 20/30 images missing `alt`, no keyboard/focus handling,
  no a11y lint in CI.
- **Observation:** brand/logo images across sign-in, permit, and welcome screens render
  with no `alt` text.
- **Recommendation:** add alt text and landmark roles; wire `@angular-eslint/template`
  a11y rules as CI-blocking; run a manual keyboard-nav pass.
- **Benefit:** WCAG 2.1 AA alignment; reduces compliance exposure for a public-facing
  municipal app.
- **Reference:** [WCAG 2.1 (W3C)](https://www.w3.org/TR/WCAG21/); [angular.dev —
  Accessibility guide](https://angular.dev/best-practices/a11y).

### P2 — Consolidate duplicated table markup into a shared component

- **Issue:** two near-identical `mat-table`/sort/paginator/search-toggle blocks in
  `visitor-type-management-add-edit.component.html`, including duplicated inline styling.
- **Observation:** the "Reason for Visit" and "Upload Reason" tables repeat the same
  structure verbatim.
- **Recommendation:** extract a shared, presentational table component (rows/columns in,
  sort/page events out) and a shared search-toggle component into `libs/ui`.
- **Benefit:** one place to fix future table behavior instead of two; removes the
  duplicated inline styling as a side effect.
- **Proven here:** `libs/ui/src/lib/city-data-table/` and
  `libs/ui/src/lib/city-search-toggle/` — presentational only, sort headers not rows,
  real pagination, `trackBy` wired.
- **Reference:** [Martin Fowler — Extract
  Component](https://martinfowler.com/articles/extract-mfe.html) pattern; existing
  `CityButton` precedent in this repo's own architecture docs.

### P2 — Introduce slim request/response models for the visitor-type save path

- **Issue:** full `Brand`/`Domain` objects (incl. `sites: Site[]`, `logoutURL`) are
  fetched just for dropdown labels, then the same full objects are PUT/POST straight
  back on save.
- **Observation:** `services/reference/reference.service.ts` — `getBrands()`,
  `getAllDomains()`, `updateVisitorType()`; `models/visitortype.model.ts` types
  `brand?: Brand`/`domain?: Domain` directly instead of an id reference.
- **Recommendation:** fetch a slim option shape (`{ id, name }`) for dropdowns; map form
  state through a dedicated request model (`UpdateVisitorTypeRequest { id, description,
  isActive, translations, brandId, domainId }`) before sending, instead of forwarding the
  rich domain model as-is.
- **Benefit:** smaller payloads in both directions; decouples the UI's save contract
  from the backend entity's full shape.
- **Proven here:** `apps/onsite/src/app/features/visitor-type-management/models/update-visitor-type-request.model.ts` —
  the mapper, with a spec test asserting `sites`/`logoutURL` never reach the payload.
- **Reference:** [Microsoft — Web API design best
  practices](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design);
  [Martin Fowler — Data Transfer Object
  pattern](https://martinfowler.com/eaaCatalog/dataTransferObject.html).

### P2 — Consolidate duplicated dependencies and align tooling versions

- **Issue:** 3 styling systems, 3 auth libraries; `@angular-eslint`/CI-pinned CLI two
  majors behind core.
- **Observation:** `package.json` — 82 total dependencies; `@angular-eslint` pinned
  `19.2.1` vs. core `^21.2.5`.
- **Recommendation:** standardize on Tailwind (per `design-tokens.md`), retire
  Bootstrap/Material style overlap incrementally; align eslint/CLI versions to core.
- **Benefit:** smaller bundle, less onboarding confusion, consistent CI/local lint
  behavior.
- **Reference:** [angular.dev — Keeping projects up to
  date](https://angular.dev/update-guide).

### P3 — Clean up interceptor error handling & dead auth config

- **Issue:** `alert(JSON.stringify(event))` on failure; unimplemented 401 `// TODO`;
  vestigial `localStorage` tokenGetter config that's never populated.
- **Observation:** `cores/http-interceptor.ts`; `app.module.ts` `JwtModule.forRoot`
  config.
- **Recommendation:** replace `alert()` with a real error/toast pattern; implement 401 →
  refresh-or-logout; delete the dead config.
- **Benefit:** removes confusing dead code; gives users an actual recovery path instead
  of a raw JSON alert.
- **Reference:** [angular.dev — HttpInterceptor
  guide](https://angular.dev/guide/http/interceptors); [OWASP — Error Handling Cheat
  Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html).

## 5. Priority Ranking

| Tier | Theme | Count | Action window |
|---|---|---|---|
| P0 | Active DoD violation — Snyk disabled on prod | 1 | This week |
| P1 | Real, observed risk — perf, lazy loading, a11y | 3 | Next 1–2 phases |
| P2 | Worth scheduling — markup/dependency/payload consolidation | 3 | Folded into Tailwind/Nx phases |
| P3 | Cleanup — dead code, error-handling polish | 1 | Opportunistic |

## 6. Suggested Roadmap

Cross-referenced against `roadmap-and-sequencing.md`'s existing order — this doesn't
replace that sequence, it inserts into it.

1. **Immediate, out of band (days, not sprints):** re-enable Snyk on the production
   pipeline.
2. **Phase 1 — Design-token bug fixes** (existing, size S).
3. **Phase 2 — Folder restructuring** (existing, size M).
4. **Phase 2.5 — Accessibility quick wins & subscription cleanup** (new, size M, can run
   parallel to Phase 2): alt text, landmark roles, CI-blocking a11y lint; `OnPush`/
   `takeUntilDestroyed` on highest-traffic screens first.
5. **Phase 3 — Tailwind adoption** (existing, size M–L) — also resolves the
   styling-system duplication.
6. **Phase 4 — Nx monorepo + `libs/ui`/`libs/core`** (existing, size L–XL, unscoped) —
   lazy-loading restructuring and the shared table/search-toggle components naturally
   land here (proven in this POC).
7. **Ongoing:** keep Snyk live on all pipelines; align tooling versions to core on every
   Angular upgrade.

## 7. Reference Documentation

- Angular — [Angular Style Guide](https://angular.dev/style-guide) — architecture,
  folder conventions.
- Angular — [Skipping component subtrees
  (OnPush)](https://angular.dev/best-practices/skipping-subtrees) — performance.
- Angular — [takeUntilDestroyed (RxJS
  interop)](https://angular.dev/api/core/rxjs-interop/takeUntilDestroyed) — subscription
  management.
- Angular — [Accessibility guide](https://angular.dev/best-practices/a11y) —
  accessibility.
- W3C — [WCAG 2.1](https://www.w3.org/TR/WCAG21/) — accessibility compliance target.
- OWASP — [XSS Prevention Cheat
  Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html)
  — the release-note innerHTML bypass.
- OWASP — [Error Handling Cheat
  Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html)
  — interceptor cleanup.
- OWASP — [Dependency-Check / SCA
  guidance](https://owasp.org/www-project-dependency-check/) — Snyk / dependency
  scanning.
- web.dev — [Reduce JavaScript payloads with
  code-splitting](https://web.dev/articles/reduce-javascript-payloads-with-code-splitting)
  — lazy loading.
- Martin Fowler — [Data Transfer Object
  pattern](https://martinfowler.com/eaaCatalog/dataTransferObject.html) — API
  overfetch/overpost fix.

## 8. Sources & Appendix

Prior session (5 existing docs, real repo): `docs/frontend-modernization-summary.md`,
`docs/architecture/folder-restructuring.md`,
`docs/architecture/nx-monorepo-and-component-library.md`,
`docs/architecture/design-tokens.md`, `docs/architecture/roadmap-and-sequencing.md`.

This assessment's fresh audit (real repo): `src/app/services/loader/loader.service.ts`,
`src/app/services/navigation/navigation.service.ts`,
`src/app/services/auth/auth.service.ts`,
`src/app/components/visitor-type-management-add-edit/visitor-type-management-add-edit.component.ts`,
`src/app/components/visitor-type-management-add-edit/visitor-type-management-add-edit.component.html`,
`src/app/components/sign-in/sign-in.component.ts`, `src/app/app-routing.module.ts`,
`src/app/app.module.ts`, `angular.json`, `karma.conf.js`, `karma.conf.ci.js`,
`package.json`, `src/app/components/release-note/release-note.component.html`,
`src/app/pipes/safe.pipe.ts`, `src/app/pipes/replace-placeholder.pipe.ts`,
`src/app/cores/http-interceptor.ts`, `src/app/shared/custom-validators.ts`,
`src/app/services/reference/reference.service.ts`,
`src/app/models/visitortype.model.ts`, `src/app/models/brand.model.ts`,
`src/app/models/domain.model.ts`, `eslint.config.mjs`, `.snyk`,
`Build/snyk-scan.yml`, `Build/RunTests.yaml`, `build-onsite-ui-dev.yml`,
`build-onsite-ui-tst.yml`, `build-onsite-ui-uat.yml`, `build-onsite-ui-dmo-prd.yml`.

Live proof, this workspace (`onsite-ui-testing`): `apps/onsite/src/app/features/visitor-type-management/`,
`libs/ui/src/lib/city-data-table/`, `libs/ui/src/lib/city-search-toggle/`.
