import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import { ref } from 'vue';
import Input from './Input.vue';

const meta = {
  title: 'Template/Form/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    clearable: { control: 'boolean' },
    required: { control: 'boolean' },
    uppercase: { control: 'boolean' },
    showLabel: { control: 'boolean' },
    disabled: { control: 'boolean' },
    wrapp: { control: 'boolean' },
    validationOff: { control: 'boolean' },
  },
  args: {
    modelValue: 'Hello',
    label: 'Name',
    clearable: true,
    required: false,
    uppercase: false,
    showLabel: true,
    disabled: false,
    validationOff: true,
    wrapp: false,
  },
  render: args => ({
    components: { Input },
    setup: () => {
      const localValue = ref((args.modelValue as string) ?? '');
      return { args, localValue };
    },
    template: `
      <Input
        v-bind="args"
        :model-value="localValue"
        @update:modelValue="localValue = $event"
      />
    `,
  }),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement | null;
    await expect(input).not.toBeNull();
    await expect(input?.value).toBe('Hello');
  },
};

export const UppercaseAndRequired: Story = {
  args: {
    modelValue: 'sample',
    required: true,
    uppercase: true,
    label: 'Code',
  },
};
