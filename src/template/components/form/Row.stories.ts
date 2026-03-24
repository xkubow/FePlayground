import type { Meta, StoryObj } from '@storybook/vue3';
import { expect, within } from 'storybook/test';
import Row from './Row.vue';

const meta = {
  title: 'Template/Form/Row',
  component: Row,
  tags: ['autodocs'],
  render: args => ({
    components: { Row },
    setup: () => ({ args }),
    template: `
      <Row v-bind="args">
        <div>Left</div>
        <div>Right</div>
      </Row>
    `,
  }),
} satisfies Meta<typeof Row>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = canvasElement.querySelector('.el-row');

    await expect(row).not.toBeNull();
    await expect(canvas.getByText('Left')).toBeInTheDocument();
    await expect(canvas.getByText('Right')).toBeInTheDocument();
  },
};
