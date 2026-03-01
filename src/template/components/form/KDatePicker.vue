<template>
	<k-wrapper
		ref="wrapper"
		:show-label="!isHiddenLabel && showLabel"
		v-bind="{ ...base, disabled: isDisabled, validationProperty: validationPropertyCmp, label: labelText, wrapp, class: wrappClass, span }"
	>
		<el-date-picker :teleported="false" v-bind="{ ...base, disabled: isDisabled, label: showLabel ? labelText : undefined }" v-model="vmodel" />
	</k-wrapper>
</template>

<script lang="ts">
import { baseInput, baseInputProps } from '@/template/components/base/baseInput';
import { defineComponent, toRefs } from 'vue';

export default defineComponent({
	name: 'k-date-picker',
	emits: ['update:modelValue'],
	props: {
		...baseInputProps,
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
