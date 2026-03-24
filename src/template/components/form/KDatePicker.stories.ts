import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import KDatePicker from './KDatePicker.vue';

const meta = {
  title: 'Template/Form/KDatePicker',
  component: KDatePicker,
  tags: ['autodocs'],
  args: {
    modelValue: new Date('2026-01-15'),
    type: 'date',
    wrapp: false,
  },
} satisfies Meta<typeof KDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).not.toBeNull();
  },
};
