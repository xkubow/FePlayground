<template>
	<k-wrapper
		ref="wrapper"
		:show-label="!isHiddenLabel && showLabel"
		v-bind="{ ...base, disabled: isDisabled, validationProperty: validationPropertyCmp, span, class: wrappClass, wrapp: false }"
	>
		<el-checkbox
			v-bind="{ ...base, disabled: isDisabled, label: showLabel ? labelText : undefined, indeterminate, 'model-value': modelValue }"
			v-on="{ 'update:modelValue': update }"
		/>
	</k-wrapper>
</template>

<script lang="ts">
import { baseInput, baseInputProps } from '@/template/components/base/baseInput';
import _ from 'lodash';
import { computed, defineComponent, toRefs } from 'vue';

//477

export default defineComponent({
	name: 'k-check-box-3state',
	emits: ['update:modelValue'],
	props: {
		...baseInputProps,
	},
	setup(props, ctx) {
		const propsRef = toRefs(props);
		const base = baseInput(propsRef, ctx.emit);

		function map(value: unknown) {
			switch (value) {
				case false:
					return null;
				case null:
					return true;
				case true:
					return false;
				default:
					return false;
			}
		}

		function update() {
			ctx.emit('update:modelValue', map(propsRef.modelValue?.value));
		}

		const indeterminate = computed(() => (_.isNull(propsRef.modelValue?.value) ? true : false));

		return {
			base,
			...base,
			update,
			indeterminate,
		};
	},
});
</script>

<style scoped lang="scss"></style>
