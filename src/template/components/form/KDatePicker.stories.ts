import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import { ref } from 'vue';
import KDatePicker from './KDatePicker.vue';

const meta = {
  title: 'Template/Form/KDatePicker',
  component: KDatePicker,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'date' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    clearable: { control: 'boolean' },
    required: { control: 'boolean' },
    showLabel: { control: 'boolean' },
    disabled: { control: 'boolean' },
    wrapp: { control: 'boolean' },
    validationOff: { control: 'boolean' },
    type: { control: 'text' },
  },
  args: {
    modelValue: new Date('2026-01-15'),
    label: 'Date',
    clearable: true,
    required: false,
    showLabel: true,
    disabled: false,
    validationOff: true,
    type: 'date',
    wrapp: false,
  },
  render: args => ({
    components: { KDatePicker },
    setup: () => {
      const localValue = ref(args.modelValue ? new Date(args.modelValue as string | number | Date) : null);
      return { args, localValue };
    },
    template: `
      <KDatePicker
        v-bind="args"
        :model-value="localValue"
        @update:modelValue="localValue = $event"
      />
    `,
  }),
} satisfies Meta<typeof KDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).not.toBeNull();
  },
};
