import type { Meta, StoryObj } from '@storybook/vue3';
import { expect, within } from 'storybook/test';
import Col from './Col.vue';

const meta = {
  title: 'Template/Form/Col',
  component: Col,
  tags: ['autodocs'],
  args: {
    xs: 12,
  },
  render: args => ({
    components: { Col },
    setup: () => ({ args }),
    template: '<Col v-bind="args">Column Content</Col>',
  }),
} satisfies Meta<typeof Col>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const col = canvasElement.querySelector('.el-col');

    await expect(col).not.toBeNull();
    await expect(canvas.getByText('Column Content')).toBeInTheDocument();
  },
};
