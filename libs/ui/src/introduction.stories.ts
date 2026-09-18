import type { Meta, StoryObj } from '@storybook/angular';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CityButton } from './lib/city-button/city-button';
import { CityInput } from './lib/city-input/city-input';
import { CitySelect, CitySelectOption } from './lib/city-select/city-select';

const YES_NO_OPTIONS: CitySelectOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const meta: Meta = {
  title: 'Introduction',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `# @org/ui

Shared component library for City Onsite UI — Material owns behavior and
accessibility, Tailwind owns city brand color and layout. One source of
truth for what a button, an input, etc. actually look like, instead of
each product hand-rolling its own.

## Install

\`\`\`
npm install @org/ui
\`\`\`

\`\`\`ts
import { CityButton } from '@org/ui';
\`\`\`

## Run this Storybook locally

From the repo root:

\`\`\`
npm run start:storybook
\`\`\`

## Build the static site (what gets deployed)

\`\`\`
npm run build:storybook
\`\`\`

Output lands in \`dist/storybook/ui\` — a static site, safe to share with
anyone. The dev server above (\`start:storybook\`) can create and edit
stories live, so it's for whoever's building components, not for sharing
the link around.`,
      },
      page: null,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  // Same four-field form as the ui-remote form-showcase page (localhost:4201)
  // — errorMessage is only computed here, CityInput/CitySelect each gate
  // *when* to show it on their own internal touched signal.
  render: () => {
    const form = new FormGroup({
      name: new FormControl('', { nonNullable: true}),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      returningVisitor: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
      requiresBadge: new FormControl<string | null>(null, { validators: [Validators.required] }),
    });

    const nameError = () => (form.controls.name.hasError('required') ? 'Name is required.' : null);
    const emailError = () => {
      if (form.controls.email.hasError('required')) {
        return 'Email is required.';
      }
      if (form.controls.email.hasError('email')) {
        return 'Enter a valid email address.';
      }
      return null;
    };
    const returningVisitorError = () =>
      form.controls.returningVisitor.hasError('required') ? 'Please select an option.' : null;
    const requiresBadgeError = () =>
      form.controls.requiresBadge.hasError('required') ? 'Please select an option.' : null;

    return {
      props: {
        form,
        yesNoOptions: YES_NO_OPTIONS,
        nameError,
        emailError,
        returningVisitorError,
        requiresBadgeError,
      },
      moduleMetadata: {
        imports: [ReactiveFormsModule, CityInput, CitySelect, CityButton],
      },
      template: `<form class="flex flex-col gap-4 max-w-sm" [formGroup]="form">
        <city-input
          formControlName="name"
          label="Name"
          placeholder="Jane Doe"
          [required]="false"
          [errorMessage]="nameError()"
        />
        <city-input
          formControlName="email"
          label="Email"
          type="email"
          placeholder="jane@example.com"
          [required]="true"
          [errorMessage]="emailError()"
        />
        <city-select
          formControlName="returningVisitor"
          label="Returning visitor?"
          [required]="true"
          [options]="yesNoOptions"
          [errorMessage]="returningVisitorError()"
        />
        <city-select
          formControlName="requiresBadge"
          label="Requires a visitor badge?"
          [required]="true"
          [options]="yesNoOptions"
          [errorMessage]="requiresBadgeError()"
        />
        <city-button [disabled]="form.invalid" length="full">Continue</city-button>
      </form>`,
    };
  },
};
