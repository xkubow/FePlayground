import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import { ref } from 'vue';
import KColorPicker from './KColorPicker.vue';

const meta = {
  title: 'Template/Form/KColorPicker',
  component: KColorPicker,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'color' },
    label: { control: 'text' },
    clearable: { control: 'boolean' },
    required: { control: 'boolean' },
    showLabel: { control: 'boolean' },
    disabled: { control: 'boolean' },
    wrapp: { control: 'boolean' },
    validationOff: { control: 'boolean' },
  },
  args: {
    modelValue: '#409EFF',
    label: 'Color',
    clearable: true,
    required: false,
    showLabel: true,
    disabled: false,
    validationOff: true,
    wrapp: false,
  },
  render: args => ({
    components: { KColorPicker },
    setup: () => {
      const localValue = ref((args.modelValue as string) ?? '#409EFF');
      return { args, localValue };
    },
    template: `
      <KColorPicker
        v-bind="args"
        :model-value="localValue"
        @update:modelValue="localValue = $event"
      />
    `,
  }),
} satisfies Meta<typeof KColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('.el-color-picker__trigger');
    await expect(trigger).not.toBeNull();
  },
};
