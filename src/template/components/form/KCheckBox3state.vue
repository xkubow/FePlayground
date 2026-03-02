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

<script setup lang="ts">
  import { baseInput, baseInputProps } from '@/template/components/base/baseInput';
  import _ from 'lodash';
  import { computed, toRefs } from 'vue';

  const emit = defineEmits(['update:modelValue']);
  const props = defineProps({
    ...baseInputProps,
  });
  const propsRef = toRefs(props);
  const base = baseInput(propsRef, emit);
  const { validationPropertyCmp, vmodel, placeholderText, labelText, isDisabled, isHiddenLabel, isListMode } = base;
  const { showLabel, wrappClass, wrapp, span } = propsRef;

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
    emit('update:modelValue', map(propsRef.modelValue?.value));
  }

  const indeterminate = computed(() => (_.isNull(propsRef.modelValue?.value) ? true : false));
</script>

<style scoped lang="scss"></style>
