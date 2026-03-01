<template>
	<k-wrapper
		ref="wrapper"
		:show-label="!isHiddenLabel && showLabel"
		v-bind="{ ...base, disabled: isDisabled, validationProperty: validationPropertyCmp, span, class: wrappClass, wrapp: false }"
	>
		<el-checkbox v-bind="{ ...base, disabled: isDisabled, label: showLabel ? labelText : undefined, indeterminate }" v-model="vmodel" />
	</k-wrapper>
</template>

<script lang="ts">
import { baseInput, baseInputProps } from '@/template/components/base/baseInput';
import { defineComponent, toRefs } from 'vue';

export default defineComponent({
	name: 'k-check-box',
	emits: ['update:modelValue'],
	props: {
		...baseInputProps,
		indeterminate: Boolean,
	},
	setup(props, ctx) {
		const propsRef = toRefs(props);
		const base = baseInput(propsRef, ctx.emit);

		return {
			base,
			...base,
		};
	},
});
</script>

<style scoped lang="scss"></style>
