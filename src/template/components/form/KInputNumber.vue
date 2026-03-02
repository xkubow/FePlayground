<template>
  <k-wrapper
    ref="wrapper"
    :show-label="!isHiddenLabel && showLabel"
    v-bind="{ ...base, disabled: isDisabled, validationProperty: validationPropertyCmp, label: labelText, wrapp, class: wrappClass, span, required }"
  >
    <el-input
      ref="elInputRef"
      v-bind="{ ...$attrs, ...$props, ...base, disabled: isDisabled, placeholder: placeholderText }"
      v-on="{ focus, input }"
      :value-on-clear="null"
      :modelValue="vmodel"
      :class="{ list: isListMode }"
    >
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

<script setup lang="ts">
  import { baseInput, baseInputProps } from '@/template/components/base/baseInput';
  import { emptyFunc } from '@/template/utils/dataMapper';
  import type { ElInput } from 'element-plus';
  import _ from 'lodash';
  import { computed, inject, ref, toRefs } from 'vue';
  import { useKVirtualKeyboard } from './KVirtualKeyboard';
  import { useKeyboardStore } from './KVirtualKeyboard/store';
  import type { ChangeOptions } from './KVirtualKeyboard/type';

  const emit = defineEmits(['update:modelValue']);
  defineOptions({ inheritAttrs: false });
  const props = defineProps({
    ...baseInputProps,
    mask: { type: String, default: undefined },
    autosize: [Boolean, Object],
    suffixText: { type: String, default: '' },
    autofocus: { type: Boolean, default: undefined },
    isAutocomplete: { type: Boolean, default: false },
    fetchSuggestions: { type: Function, default: () => ({}) },
    maxlength: { type: Number },
    controls: { type: Boolean, default: false },
    modelValue: Number,
  });
  const propsRef = toRefs(props);
  const base = baseInput(propsRef, emit);
  const { validationPropertyCmp, vmodel: baseVmodel, placeholderText, labelText, isDisabled, isHiddenLabel, isListMode } = base;
  const { showLabel, wrappClass, wrapp, span, required, suffixText } = propsRef;
  const elInputRef = ref<typeof ElInput | null>(null);
  const changeKeyboardOptions: ChangeOptions | undefined = inject('changeKeyboardOptions');
  const keyboardStore = useKeyboardStore();

  const vmodel = computed({
    get() {
      return _.isNull(propsRef.modelValue?.value) ? null : propsRef.modelValue?.value;
    },
    set(val) {
      emit('update:modelValue', _.isUndefined(val) ? null : val);
    },
  });

  function input(val: string) {
    if (val.length) {
      const num = parseInt(val);
      !isNaN(num) && (vmodel.value = num);
    } else {
      vmodel.value = null;
    }
  }
  if (!changeKeyboardOptions) throw Error('changeKeyboardOptions not injected');

  const filterSubmit = inject('filterSubmit', emptyFunc);

  function onKeyReleased(button: string) {
    if (isListMode && button === '{enter}') {
      filterSubmit && filterSubmit();
      keyboardStore.dialogVisible = false;
    }
  }

  const { focus } = useKVirtualKeyboard({ changeKeyboardOptions, vmodel, layoutType: 'numeric', onKeyReleased });
</script>

<style lang="scss" scoped></style>
