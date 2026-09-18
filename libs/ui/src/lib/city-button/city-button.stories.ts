import type { Meta, StoryObj } from '@storybook/angular';
import { CityButton } from './city-button';

type StoryArgs = CityButton & { label: string };

const usageSnippet = `import { CityButton } from '@org/ui';

// add CityButton to your component's imports, then:
<city-button variant="primary" size="md">Continue</city-button>`;

const meta: Meta<StoryArgs> = {
  title: 'CityButton',
  component: CityButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Material for behavior/accessibility, Tailwind for city color — a raised button for \`primary\`/\`destructive\`, a stroked button for \`secondary\`.

\`\`\`ts
${usageSnippet}
\`\`\``,
      },
      source: {
        code: '<city-button variant="primary" size="md">Continue</city-button>',
        // Expanded by default, not click-to-reveal — same "code sits right
        // next to the live example" pattern as Angular Material/Tailwind's
        // own component docs.
        state: 'open',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive'],
      description: 'Visual style. `primary`/`destructive` render as a raised button, `secondary` as a stroked button.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button height and font size.',
    },
    length: {
      control: 'select',
      options: ['auto', 'full'],
      description: '`full` stretches the button to 100% of its container width.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button and applies disabled styling.',
    },
    label: {
      control: 'text',
      description:
        'Projected button text (not a real CityButton input — story-only control).',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    length: 'auto',
    disabled: false,
    label: 'Continue',
  },
  render: (args) => ({
    props: args,
    template: `<city-button [variant]="variant" [size]="size" [length]="length" [disabled]="disabled">{{ label }}</city-button>`,
  }),
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Button: Story = {};
