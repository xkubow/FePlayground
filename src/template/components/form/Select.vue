<script setup lang="ts">
  import { baseInput, baseInputProps } from '@/template/components/base/baseInput';
  import type { DropdownItem } from '@/template/page/@types/mode';
  import type { ElSelect } from 'element-plus';
  import { useStore as useCacheStore } from '@/template/cache';
  import { computed, inject, nextTick, ref, toRefs, type PropType } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { ChangeOptions } from './KVirtualKeyboard/type';
  import { useKVirtualKeyboard } from './KVirtualKeyboard';
  import { useKeyboardStore } from './KVirtualKeyboard/store';
  import { emptyFunc } from '@/template/utils/dataMapper';
  import { isArray } from 'lodash-es';

  const emit = defineEmits(['update:modelValue', 'change', 'show-more']);
  const props = defineProps({
    ...baseInputProps,
    showMore: Boolean,
    multiple: Boolean,
    filterable: Boolean,
    allowCreate: Boolean,
    defaultFirstOption: Boolean,
    optionsValueName: { type: String, default: 'value' },
    optionsTextName: { type: String, default: 'text' },
    options: Array as PropType<Array<DropdownItem<string | number>>>,
  });
  const propsRef = toRefs(props);
  const base = baseInput(propsRef, emit);
  const { validationPropertyCmp, vmodel, placeholderText, labelText, isDisabled, isHiddenLabel, isListMode } = base;
  // These are direct props, not from baseInput
  const { showLabel, wrappClass, wrapp, span } = propsRef;
  const { t } = useI18n();
  const cacheStore = useCacheStore();
  const keyboardStore = useKeyboardStore();
  const changeKeyboardOptions: ChangeOptions | undefined = inject('changeKeyboardOptions');
  const filterSubmit = inject('filterSubmit', emptyFunc);
  const extended = ref(false);
  const optionsDisabledFiltered = computed(() => {
    return propsRef.options?.value?.filter((i) => !(i.disabled && vmodel.value !== i.value));
  });
  const optionsExtendedFiltered = computed(() => {
    return optionsDisabledFiltered?.value?.filter((i) => extended.value || !i.extended || vmodel.value === i.value);
  });
  const selectOption = computed(() => {
    const items = optionsDisabledFiltered.value as DropdownItem[];
    const isSelected = (value: number | string): boolean => {
      if (propsRef.multiple.value && isArray(vmodel.value)) return vmodel.value?.includes(value);
      else return vmodel.value === value;
    };
    return items.map((i) => ({ ...i, selected: isSelected(i.value) }));
  });
  function visibleChange(visible: boolean) {
    if (visible) extended.value = false;
  }
  function clear() {
    const val = Array.isArray(vmodel.value) ? [] : null;
    emit('update:modelValue', val);
  }
  function change(payload: unknown) {
    emit('change', payload);
  }
  function removeTag(payload: unknown) {
    //
  }
  function onKeyReleased(button: string) {
    if (isListMode && button === '{enter}') {
      filterSubmit && filterSubmit();
      keyboardStore.dialogVisible = false;
    }
  }
  const queryStr = ref<null | string>(null);
  if (!changeKeyboardOptions) throw Error('changeKeyboardOptions not injected');
  const keyboard = useKVirtualKeyboard({
    changeKeyboardOptions,
    vmodel: queryStr,
    onChange: () => false,
    selectOption,
    onKeyReleased,
  });
  function focus(e: FocusEvent) {
    if (!cacheStore.nastaveni?.useSwKeyboard) return;
    keyboardStore.selectItem = (item: DropdownItem<string | number> & { selected?: boolean }) => {
      if (propsRef.multiple.value) {
        const selected = vmodel.value as [];
        if (item.selected) {
          vmodel.value = [...selected, item[propsRef.optionsValueName.value]];
        } else {
          const index = selected.findIndex((i) => i === item.value);
          vmodel.value = [...selected.slice(0, index), ...selected.slice(index + 1)];
        }
      } else {
        vmodel.value = item[propsRef.optionsValueName.value];
        if (isListMode) {
          filterSubmit && filterSubmit();
          keyboardStore.dialogVisible = false;
        }
      }
      emit('change', item[propsRef.optionsValueName.value]);
    };
    keyboard.focus(e);
  }
  const popOverClassName = computed(() => (cacheStore.nastaveni?.useSwKeyboard ? 'hide-popover' : undefined));
</script>

<template>
  <k-wrapper
    ref="wrapper"
    :show-label="!isHiddenLabel && showLabel"
    :disabled="isDisabled"
    :label="labelText"
    :validation-property="validationPropertyCmp"
    :span="span"
    :class="wrappClass"
    :wrapp="wrapp"
  >
    <el-select
      :teleported="false"
      class="k-select"
      v-model="vmodel"
      v-bind="{ ...$props, ...$attrs, disabled: isDisabled }"
      :value-key="optionsValueName"
      :placeholder="placeholderText"
      @change="change"
      @clear="clear"
      @remove-tag="removeTag"
      @visible-change="visibleChange"
      v-on="{ focus }"
      :popper-class="popOverClassName"
    >
      <slot>
        <el-option
          v-for="item in optionsExtendedFiltered"
          :key="item[optionsValueName]"
          :label="item[optionsTextName]"
          :value="item[optionsValueName]"
          :disabled="item.disabled"
        ></el-option>
        <el-option v-if="!extended && showMore" value="-1" :style="{ padding: '0px' }">
          <div @click.stop="extended = true" :style="{ padding: '0 32px 0 20px' }">
            <span>{{ t('showMore') }}</span>
          </div>
        </el-option>
      </slot>
    </el-select>
    <template #colsuffix>
      <slot name="colsuffix" />
    </template>
  </k-wrapper>
</template>

<style lag="scss" scoped></style>
