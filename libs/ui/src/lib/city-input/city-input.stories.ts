import type { Meta, StoryObj } from '@storybook/angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CityInput } from './city-input';

// Not `CityInput & { disabled; touched }` — CityInput inherits protected
// `disabled`/`touched` signal members from CityFormControlBase, and
// intersecting with the class type collides with those (TS2322: the args'
// plain `boolean` can't satisfy `WritableSignal<boolean> & boolean`). This
// only needs the real public inputs plus the two story-only controls.
interface StoryArgs {
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'password' | 'number';
  hint: string | null;
  required: boolean;
  errorMessage: string | null;
  disabled: boolean;
  touched: boolean;
}

const usageSnippet = `import { CityInput } from '@org/ui';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// add ReactiveFormsModule + CityInput to your component's imports, then:
<city-input [formControl]="myControl" label="Email" placeholder="you@city.gov" />`;

const meta: Meta<StoryArgs> = {
  title: 'CityInput',
  component: CityInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Material owns field semantics (label float, focus outline, error slot, a11y) — Tailwind only touches layout. Implements \`ControlValueAccessor\`, so it plugs into Reactive Forms via \`[formControl]\`, not a plain value binding.

\`\`\`ts
${usageSnippet}
\`\`\``,
      },
      source: {
        code: '<city-input [formControl]="myControl" label="Email" placeholder="you@city.gov" />',
        state: 'open',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Floating label text.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder shown inside the field when empty.',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
      description: 'Native input type.',
    },
    hint: {
      control: 'text',
      description: 'Helper text shown below the field when there is no error.',
    },
    required: {
      control: 'boolean',
      description: 'Marks the field required and appends `*` to the label.',
    },
    errorMessage: {
      control: 'text',
      description:
        'Error text shown below the field — only renders once the field is touched (see the `touched` control below).',
    },
    disabled: {
      control: 'boolean',
      description:
        'Story-only control, not a real CityInput input. CityInput is a ControlValueAccessor — real consumers disable it through the FormControl itself (`control.disable()`), not a plain [disabled] binding.',
    },
    touched: {
      control: 'boolean',
      description:
        'Story-only control, not a real CityInput input. Lets you preview the error state without clicking into the field and blurring it — `showError` is normally gated on a real blur event.',
    },
  },
  args: {
    label: '',
    placeholder: 'you@city.gov',
    type: 'email',
    hint: null,
    required: false,
    errorMessage: 'Enter a valid email address',
    disabled: false,
    touched: false,
  },
  render: (args) => {
    const control = new FormControl({ value: '', disabled: args.disabled });
    if (args.touched) {
      control.markAsTouched();
    }
    return {
      props: { ...args, control },
      moduleMetadata: {
        imports: [ReactiveFormsModule],
      },
      template: `<city-input
        [formControl]="control"
        [label]="label"
        [placeholder]="placeholder"
        [type]="type"
        [hint]="hint"
        [required]="required"
        [errorMessage]="errorMessage"
      />`,
    };
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Input: Story = {};
