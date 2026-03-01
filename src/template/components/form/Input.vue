<template>
	<k-wrapper
		ref="wrapper"
		:show-label="!isHiddenLabel && showLabel"
		v-bind="{ ...base, disabled: isDisabled, validationProperty: validationPropertyCmp, label: labelText, wrapp, class: wrappClass, span, required }"
	>
		<el-input ref="elInputRef" v-bind="{ ...$attrs, ...$props, ...base, disabled: isDisabled, placeholder: placeholderText }" v-model="vmodel" v-on="{ focus }">
			<template v-if="$slots.suffix || suffixText" v-slot:suffix>
				{{ suffixText }}
				<slot name="suffix" />
			</template>
			<template v-if="$slots.prepend" v-slot:prepend>
				<slot name="prepend" />
			</template>
			<template v-if="$slots.append" v-slot:append>
				<slot name="append" />
			</template>
		</el-input>
		<template #colsuffix>
			<slot name="colsuffix" />
		</template>
		<slot />
	</k-wrapper>
</template>

<script lang="ts">
import { baseInput, baseInputProps } from '@/template/components/base/baseInput';
import { emptyFunc } from '@/template/utils/dataMapper';
import type ElInput from 'element-plus/lib/components/input';
import { defineComponent, inject, ref, toRefs } from 'vue';
import { useKVirtualKeyboard } from './KVirtualKeyboard';
import { useKeyboardStore } from './KVirtualKeyboard/store';
import type { ChangeOptions } from './KVirtualKeyboard/type';

export default defineComponent({
	name: 'k-input',
	emits: ['update:modelValue'],
	inheritAttrs: false,
	props: {
		...baseInputProps,
		mask: { type: String, default: undefined },
		type: { type: String, default: 'text' },
		rows: Number,
		autosize: [Boolean, Object],
		suffixText: { type: String, default: '' },
		autofocus: { type: Boolean, default: undefined },
		isAutocomplete: { type: Boolean, default: false },
		fetchSuggestions: { type: Function, default: () => ({}) },
		maxlength: { type: Number },
	},
	setup(props, ctx) {
		const propsRef = toRefs(props);
		const base = baseInput(propsRef, ctx.emit);

		const elInputRef = ref<typeof ElInput | null>(null);

		const keyboardStore = useKeyboardStore();
		const changeKeyboardOptions: ChangeOptions | undefined = inject('changeKeyboardOptions');
		const filterSubmit = inject('filterSubmit', emptyFunc);

		function onKeyReleased(button: string) {
			if (base.isListMode && button === '{enter}') {
				filterSubmit && filterSubmit();
				keyboardStore.dialogVisible = false;
			}
		}

		if (!changeKeyboardOptions) throw Error('changeKeyboardOptions not injected');
		const { focus } = useKVirtualKeyboard({ changeKeyboardOptions, vmodel: base.vmodel, onKeyReleased });
		return {
			base,
			focus,
			...base,
			elInputRef,
		};
	},
});
</script>

<style lang="scss" scoped></style>
