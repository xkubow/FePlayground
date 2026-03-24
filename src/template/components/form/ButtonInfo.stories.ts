import type { Meta, StoryObj } from '@storybook/vue3';
import { expect, within } from 'storybook/test';
import ButtonInfo from './ButtonInfo.vue';

const meta = {
  title: 'Template/Form/ButtonInfo',
  component: ButtonInfo,
  tags: ['autodocs'],
  render: args => ({
    components: { ButtonInfo },
    setup: () => ({ args }),
    template: '<ButtonInfo v-bind="args">Open Details</ButtonInfo>',
  }),
} satisfies Meta<typeof ButtonInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvasElement.querySelector('.el-button');

    await expect(button).not.toBeNull();
    await expect(canvas.getByText('Open Details')).toBeInTheDocument();
  },
};
