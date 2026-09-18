import type { Preview } from '@storybook/angular';

const preview: Preview = {
  parameters: {
    docs: {
      // @storybook/addon-docs's Code tab (alongside Controls/Actions/
      // Interactions) is opt-in — disabled by default unless this is set,
      // even with the addon registered in main.ts. Set globally so every
      // component's story gets it, not just CityButton's.
      codePanel: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      // Hides the "Update story"/"Create new story"/"Reset" bar (and the
      // "You modified this story..." save-confirmation prompt) that appears
      // under Controls once args differ from the story's defaults. Real,
      // documented parameter — confirmed by reading the manager source
      // (`showSaveFromUI` in common-manager.js), not a workaround. Doesn't
      // touch the underlying save/create-story backend (still dev-only per
      // the governance rule above), just stops it surfacing in the UI.
      disableSaveFromUI: true,
    },
    // Introduction first, then everything else alphabetically — otherwise
    // a docs-only entry with no component sorts wherever CSF happens to
    // place it, which is wherever, not necessarily first.
    options: {
      storySort: {
        order: ['Introduction', '*'],
      },
    },
  },
};

export default preview;
