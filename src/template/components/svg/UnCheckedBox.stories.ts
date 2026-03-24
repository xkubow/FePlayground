import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from '@storybook/test';
import UnCheckedBox from './UnCheckedBox.vue';

const meta = {
  title: 'Template/SVG/UnCheckedBox',
  component: UnCheckedBox,
  tags: ['autodocs'],
  args: {
    color: '#dc2626',
  },
  render: args => ({
    components: { UnCheckedBox },
    setup: () => ({ args }),
    template: `
      <svg viewBox="0 0 24 24" width="64" height="64">
        <UnCheckedBox v-bind="args" />
      </svg>
    `,
  }),
} satisfies Meta<typeof UnCheckedBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('g');
    const path = canvasElement.querySelector('path');

    await expect(canvasElement.querySelector('svg')).not.toBeNull();
    await expect(group).not.toBeNull();
    await expect(path).not.toBeNull();
    await expect(group?.getAttribute('fill')).toBe('#dc2626');
  },
};
