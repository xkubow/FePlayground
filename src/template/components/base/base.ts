import type { Base } from '@/template/components/@types/base';
import { pageMode as pageModeInit } from '@/template/page/providers/pageMode';
import type { Ref, ToRefs } from 'vue';
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import type { BaseProps } from '../@types/input';

export const baseProps = {
  span: { type: Number },
  sm: { type: Number },
  xs: { type: Number, default: 24 },
  placeholder: String,
  placeholderKey: String,
  labelKey: String,
  labelKeySuffix: { type: String, default: '' },
  label: String,
  showLabel: { type: Boolean, default: true },
  overwriteHiddenLabel: { type: Boolean, default: false },
  titleKey: String,
  title: String,
  disabled: { type: Boolean, default: undefined },
  required: Boolean,
};

export function useDisabled(disabled?: Ref<boolean | undefined>) {
  const router = useRouter();
  const pageModeProvider = pageModeInit(router.currentRoute);
  const isDisabledByEvent = inject<Ref<boolean> | undefined>('disableAll', undefined);
  const isDisabled = computed((): boolean => {
    if (disabled?.value !== undefined) {
      return !!disabled.value;
    }
    return (
      isDisabledByEvent?.value ||
      (!pageModeProvider.isEditMode.value && !pageModeProvider.isCreateMode.value && !pageModeProvider.isListMode.value && !pageModeProvider.isSelectList.value)
    );
  });
  return { isDisabledByEvent, isDisabled };
}

export function useBase<P extends ToRefs<BaseProps>>(props: P): Base {
  const router = useRouter();
  const { t } = useI18n();

  // const mode = inject<PageMode | undefined>('mode', undefined);
  // const pageMode = computed((): PageMode | undefined => mode);
  const pageModeProvider = pageModeInit(router.currentRoute);
  const isHiddenLabel = computed((): boolean => pageModeProvider.isListMode.value || pageModeProvider.isSelectList.value);
  const { isDisabledByEvent, isDisabled } = useDisabled(props.disabled);

  function getText(value?: string, key?: string, defaultValue?: string): string | undefined {
    if (value) {
      return value;
    }
    if (key) {
      return t(key);
    }
    return defaultValue;
  }
  const labelText = computed((): string => {
    return props.label?.value || (props.labelKey?.value && t(props.labelKey.value) + props.labelKeySuffix?.value) || '';
  });
  const titleText = computed((): string | undefined => {
    return props.title?.value ?? labelText.value;
  });

  const placeholderText = computed((): string | undefined => {
    return props.placeholder?.value ?? labelText.value;
  });

  return { ...pageModeProvider, placeholderText, t, isDisabledByEvent, titleText, isHiddenLabel, isDisabled, labelText };
}
