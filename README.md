# City Onsite UI

A Storybook-documented Angular component library (`@org/ui`) — the artifact this repo exists to produce, so other teams can consume it directly.

## Built on Signals

Every component is signals-first, so consumers wire it up with plain Angular signal APIs — no `EventEmitter`, no manual change detection:

- **`input()`** for one-way props (e.g. `CityButton`'s `variant`, `size`)
- **`model()`** for two-way bound state (e.g. `CitySearchToggle`'s `query`)
- **`output()`** for events (e.g. `CityDataTable`'s `sortChange`)
- **`computed()`** for derived state (e.g. validation/error display)

`CityInput`, `CitySelect`, and `CityDatepicker` share one signal-backed `ControlValueAccessor` base (`CityFormControlBase`), so they drop straight into reactive/template-driven forms with signal-based value, touched, and error state already wired.

Browse live, working examples of every component — with controls you can tweak in the browser — in Storybook (`npm run start:storybook`).

## Install

```bash
npm install
```

## Run

```bash
# Serve the onsite host app + ui-remote remote together
npm start

# Run Storybook for the ui library
npm run start:storybook

# Build a static Storybook site
npm run build:storybook
```
