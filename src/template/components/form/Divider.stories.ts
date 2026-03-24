import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import Divider from './Divider.vue';

const meta = {
  title: 'Template/Form/Divider',
  component: Divider,
  tags: ['autodocs'],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('.el-divider');
    await expect(divider).not.toBeNull();
  },
};
