import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import { ref } from 'vue';
import KInputNumber from './KInputNumber.vue';

const meta = {
  title: 'Template/Form/KInputNumber',
  component: KInputNumber,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'number' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    clearable: { control: 'boolean' },
    required: { control: 'boolean' },
    showLabel: { control: 'boolean' },
    disabled: { control: 'boolean' },
    wrapp: { control: 'boolean' },
    validationOff: { control: 'boolean' },
    controls: { control: 'boolean' },
  },
  args: {
    modelValue: 25,
    label: 'Age',
    clearable: true,
    required: false,
    showLabel: true,
    disabled: false,
    validationOff: true,
    controls: false,
    wrapp: false,
  },
  render: args => ({
    components: { KInputNumber },
    setup: () => {
      const localValue = ref(
        typeof args.modelValue === 'number' ? args.modelValue : args.modelValue ? Number(args.modelValue) : null,
      );
      return { args, localValue };
    },
    template: `
      <KInputNumber
        v-bind="args"
        :model-value="localValue"
        @update:modelValue="localValue = $event"
      />
    `,
  }),
} satisfies Meta<typeof KInputNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement | null;
    await expect(input).not.toBeNull();
    await expect(input?.value).toBe('25');
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).not.toBeNull();
    await expect(input?.getAttribute('disabled')).not.toBeNull();
  },
};
