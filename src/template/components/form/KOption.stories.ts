import type { Meta, StoryObj } from '@storybook/vue3';
import { expect, within } from 'storybook/test';
import KOption from './KOption.vue';

const meta = {
  title: 'Template/Form/KOption',
  component: KOption,
  tags: ['autodocs'],
  args: {
    label: 'Option A',
    value: 'a',
  },
  render: args => ({
    components: { KOption },
    setup: () => ({ args }),
    template: `
      <el-select model-value="a" style="width: 220px">
        <KOption v-bind="args" />
      </el-select>
    `,
  }),
} satisfies Meta<typeof KOption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Option A')).toBeInTheDocument();
  },
};
