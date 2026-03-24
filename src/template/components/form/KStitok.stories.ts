import type { Meta, StoryObj } from '@storybook/vue3';
import { expect, within } from 'storybook/test';
import KStitok from './KStitok.vue';

const meta = {
  title: 'Template/Form/KStitok',
  component: KStitok,
  tags: ['autodocs'],
  render: args => ({
    components: { KStitok },
    setup: () => ({ args }),
    template: '<KStitok v-bind="args">Battery Label</KStitok>',
  }),
} satisfies Meta<typeof KStitok>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tag = canvasElement.querySelector('.el-tag');

    await expect(tag).not.toBeNull();
    await expect(canvas.getByText('Battery Label')).toBeInTheDocument();
  },
};
