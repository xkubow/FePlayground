import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import KIcon from './KIcon.vue';

const meta = {
  title: 'Template/Form/KIcon',
  component: KIcon,
  tags: ['autodocs'],
  render: args => ({
    components: { KIcon },
    setup: () => ({ args }),
    template: `
      <KIcon v-bind="args">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-label="dot-icon">
          <circle cx="12" cy="12" r="8" />
        </svg>
      </KIcon>
    `,
  }),
} satisfies Meta<typeof KIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.el-icon');
    const circle = canvasElement.querySelector('circle');

    await expect(icon).not.toBeNull();
    await expect(circle).not.toBeNull();
  },
};
