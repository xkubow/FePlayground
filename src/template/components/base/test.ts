import { defineComponent } from 'vue';

const propsDef = {
	multiple: { type: Boolean },
};

export default defineComponent({
	name: 'k-select',
	emits: ['update:modelValue', 'change'],
	props: {
		...propsDef,
	},
	setup(props) {
		return {};
	},
});
