import type { Meta, StoryObj } from '@storybook/vue3';
import { expect, within } from 'storybook/test';
import KDescriptions from './KDescriptions.vue';

const meta = {
  title: 'Template/Form/KDescriptions',
  component: KDescriptions,
  tags: ['autodocs'],
  args: {
    column: 1,
    border: true,
  },
  render: args => ({
    components: { KDescriptions },
    setup: () => ({ args }),
    template: `
      <KDescriptions v-bind="args">
        <el-descriptions-item label="State">Ready</el-descriptions-item>
      </KDescriptions>
    `,
  }),
} satisfies Meta<typeof KDescriptions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvasElement.querySelector('.el-descriptions');

    await expect(root).not.toBeNull();
    await expect(canvas.getByText('State')).toBeInTheDocument();
    await expect(canvas.getByText('Ready')).toBeInTheDocument();
  },
};
