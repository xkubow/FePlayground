<template>
	<k-wrapper
		ref="wrapper"
		:show-label="!isHiddenLabel && showLabel"
		v-bind="{ ...base, disabled: isDisabled, validationProperty: validationPropertyCmp, label: labelText, wrapp, class: wrappClass, span }"
	>
		<el-color-picker v-bind="{ ...base, disabled: isDisabled, label: showLabel ? labelText : undefined }" v-model="vmodel" />
	</k-wrapper>
</template>


<script setup lang="ts">
  import { baseInput, baseInputProps } from '@/template/components/base/baseInput';
  import { toRefs } from 'vue';

  const emit = defineEmits(['update:modelValue']);
  const props = defineProps({
    ...baseInputProps,
  });
  const propsRef = toRefs(props);
  const base = baseInput(propsRef, emit);
  const {
    validationPropertyCmp,
    vmodel,
    placeholderText,
    labelText,
    isDisabled,
    isHiddenLabel,
    isListMode,
  } = base;
  const { showLabel, wrappClass, wrapp, span } = propsRef;
</script>

<style scoped lang="scss">
.el-color-picker__trigger {
	width: 220px;
}
</style>
