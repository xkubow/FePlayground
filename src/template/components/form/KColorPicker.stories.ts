import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import KColorPicker from './KColorPicker.vue';

const meta = {
  title: 'Template/Form/KColorPicker',
  component: KColorPicker,
  tags: ['autodocs'],
  args: {
    modelValue: '#409EFF',
    wrapp: false,
  },
} satisfies Meta<typeof KColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('.el-color-picker__trigger');
    await expect(trigger).not.toBeNull();
  },
};
