import { defineComponent } from 'vue';

const propsDef = {
  multiple: { type: Boolean },
};

export default defineComponent({
  name: 'KSelect',
  props: {
    ...propsDef,
  },
  emits: ['update:modelValue', 'change'],
  setup(props) {
    return {};
  },
});
