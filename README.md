# City Onsite UI

A standalone Angular component library (`@org/ui`) built signals-first and documented in [Storybook](https://storybook.js.org/) so other teams can consume it directly — not just demo it in isolation. It ships inside an Nx monorepo alongside a host app (`onsite`) and a remote micro-frontend (`ui-remote`) wired through Native Federation, so the library is a real federated module, not a local-only sandbox.

## Highlights

- **Signals-first components.** Every component is built on Angular Signals — `input()`/`model()` for props and two-way bound state, `computed()`/`effect()` for derived and reactive logic, `output()` for event emission — with no `EventEmitter` boilerplate.
- **Shared reactive form-control base.** `CityInput`, `CitySelect`, and `CityDatepicker` extend one signal-backed `ControlValueAccessor` base class (`CityFormControlBase`), so validation, touched/error state, and CVA plumbing are written once instead of copy-pasted per component.
- **Storybook as the consumption surface.** Components ship with `autodocs`, live controls, and usage snippets so consumers can browse and copy real examples rather than reading source.
- **Material + Tailwind hybrid styling.** Angular Material drives behavior and accessibility; Tailwind utilities and CSS custom properties drive the visual design tokens.
- **Federation-ready.** `onsite` (host) and `ui-remote` (remote) are configured with `@angular-architects/native-federation`, so UI built here can be loaded at runtime by another application.

### Example: a signals-based event emitter

```ts
export class CityDataTable<T extends { id: string | number }> {
  rows = input.required<T[]>();
  columns = input.required<CityTableColumn<T>[]>();

  sortChange = output<Sort>();

  protected readonly pagedRows = computed(() => /* derived from rows + page state */);

  protected onSort(sort: Sort): void {
    this.sortChange.emit(sort);
  }
}
```

## Project Structure

```
├── apps/
│   ├── onsite/        - Native Federation host application
│   └── ui-remote/      - Native Federation remote application
├── libs/
│   └── ui/             - @org/ui — the shared component library, documented in Storybook
│       ├── .storybook/
│       └── src/lib/
│           ├── city-button/
│           ├── city-data-table/
│           ├── city-datepicker/
│           ├── city-input/
│           ├── city-page-shell/
│           ├── city-search-toggle/
│           ├── city-select/
│           └── shared/               - CityFormControlBase (shared CVA base class)
├── nx.json
└── package.json
```

## Components

| Component | Purpose |
| --- | --- |
| `CityButton` | Raised/stroked button, Material for behavior, Tailwind-driven variants (`primary`/`secondary`/`destructive`) and sizes |
| `CityInput` | Signal-backed `ControlValueAccessor` text input |
| `CitySelect` | Signal-backed `ControlValueAccessor` select, wraps `mat-select` |
| `CityDatepicker` | Signal-backed `ControlValueAccessor` date picker |
| `CityDataTable` | Generic, paginated, sortable data table (`sortChange` output) |
| `CityPageShell` | Page-level layout shell |
| `CitySearchToggle` | Expand/collapse search input using a `model()` two-way signal |

## Quick Start

```bash
# Install dependencies
npm install

# Serve the onsite host app + ui-remote remote together
npm start

# Run Storybook for the ui library
npm run start:storybook

# Build a static Storybook site
npm run build:storybook
```

## Useful Commands

```bash
npx nx graph                       # Interactive dependency graph
npx nx run onsite:serve            # Serve the host app only
npx nx run ui-remote:serve         # Serve the remote app only
npx nx run ui:storybook            # Serve Storybook for the ui library
npx nx run ui:test                 # Test the ui library
npx nx run-many -t build           # Build all projects
npx nx run-many -t test            # Test all projects
npx nx run-many -t lint            # Lint all projects
npx nx affected -t build test lint # Run tasks only against affected projects
```

## Tech Stack

- **Angular 21** (standalone components, Signals, zoneless-ready)
- **Angular Material** + **Tailwind CSS 4**
- **Nx 23** monorepo with module boundaries and affected-based CI
- **Storybook 10** (`@storybook/angular`) for component documentation and consumption
- **Native Federation** (`@angular-architects/native-federation`) for runtime micro-frontend composition
- **Vitest** + **Playwright** for unit and e2e testing
