import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import CheckedBox from './CheckedBox.vue';

const meta = {
  title: 'Template/SVG/CheckedBox',
  component: CheckedBox,
  tags: ['autodocs'],
  args: {
    color: '#16a34a',
  },
  render: args => ({
    components: { CheckedBox },
    setup: () => ({ args }),
    template: `
      <svg viewBox="0 0 24 24" width="64" height="64">
        <CheckedBox v-bind="args" />
      </svg>
    `,
  }),
} satisfies Meta<typeof CheckedBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const path = canvasElement.querySelector('path');
    const group = canvasElement.querySelector('g');

    await expect(canvasElement.querySelector('svg')).not.toBeNull();
    await expect(group).not.toBeNull();
    await expect(path).not.toBeNull();
    await expect(group?.getAttribute('fill')).toBe('#16a34a');
  },
};
