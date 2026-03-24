import type { Meta, StoryObj } from '@storybook/vue3';
import { expect, within } from 'storybook/test';
import FormItem from './FormItem.vue';

const meta = {
  title: 'Template/Form/FormItem',
  component: FormItem,
  tags: ['autodocs'],
  args: {
    label: 'Name',
  },
  render: args => ({
    components: { FormItem },
    setup: () => ({ args }),
    template: `
      <el-form>
        <FormItem v-bind="args">
          <input value="Alice" />
        </FormItem>
      </el-form>
    `,
  }),
} satisfies Meta<typeof FormItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const formItem = canvasElement.querySelector('.el-form-item');

    await expect(formItem).not.toBeNull();
    await expect(canvas.getByDisplayValue('Alice')).toBeInTheDocument();
  },
};
