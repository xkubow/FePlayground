import type { Meta, StoryObj } from '@storybook/vue3';
import { expect, userEvent, within } from 'storybook/test';
import KPopover from './KPopover.vue';

const meta = {
  title: 'Template/Form/KPopover',
  component: KPopover,
  tags: ['autodocs'],
  args: {
    trigger: 'click',
    width: 220,
  },
  render: args => ({
    components: { KPopover },
    setup: () => ({ args }),
    template: `
      <KPopover v-bind="args">
        <template #reference>
          <button type="button">Open Popover</button>
        </template>
        <span>Popover content</span>
      </KPopover>
    `,
  }),
} satisfies Meta<typeof KPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole('button', { name: 'Open Popover' });

    await userEvent.click(btn);
    await expect(btn).toBeInTheDocument();
  },
};
