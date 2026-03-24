import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from '@storybook/test';
import HighVoltageSign from './HighVoltageSign.vue';

const meta = {
  title: 'Vozidlo/HighVoltageSign',
  component: HighVoltageSign,
  tags: ['autodocs'],
} satisfies Meta<typeof HighVoltageSign>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const paths = canvasElement.querySelectorAll('path');

    await expect(canvasElement.querySelector('svg')).not.toBeNull();
    await expect(paths.length).toBe(3);
  },
};
