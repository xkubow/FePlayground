import { PageMode, pageMode as pageModeInit } from '@/template/page/providers/pageMode';
import { snakeToPascalCase } from '@/template/utils/stringHelper';
import type { ComponentObjectPropsOptions, Ref } from 'vue';
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import type { BaseProps } from '../@types/input';

//#region Base

export const baseProps: ComponentObjectPropsOptions<BaseProps> = {
  span: { type: Number, default: 24 },
  placeholder: String,
  placeholderKey: String,
  labelKey: String,
  labelKeySuffix: { type: String, default: '' },
  label: String,
  titleKey: String,
  title: String,
  disabled: { type: Boolean, default: undefined },
};

export type BaseType = {
  disabled: Ref<boolean>;
  title: Ref<string | undefined>;
  titleKey: Ref<string | undefined>;
  labelKey: Ref<string | undefined>;
  placeholder: Ref<string | undefined>;
  placeholderKey: Ref<string | undefined>;
  label: Ref<string | undefined>;
  labelKeySuffix: Ref<string | undefined>;
};

export function base({ disabled, title, titleKey, labelKey, placeholder, placeholderKey, label, labelKeySuffix }: BaseType) {
  const router = useRouter();
  const { t } = useI18n();

  const mode = inject<PageMode | undefined>('mode', undefined);
  const isDisabledByEvent = inject<boolean | undefined>('disableAll', undefined);
  const pageMode = computed((): PageMode | undefined => mode);
  const pageModeProvider = pageModeInit(router.currentRoute);
  const isHiddenLabel = computed((): boolean => pageModeProvider.isListMode.value || pageModeProvider.isSelectList.value);
  const isDisabled = computed((): boolean => {
    if (disabled.value !== undefined) {
      return !!disabled.value;
    }
    return (
      isDisabledByEvent ||
      (!pageModeProvider.isEditMode.value && !pageModeProvider.isCreateMode.value && !pageModeProvider.isListMode.value && !pageModeProvider.isSelectList.value)
    );
  });
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
    return label.value || (labelKey.value && t(labelKey.value) + labelKeySuffix.value) || '??';
  });
  const titleText = computed((): string | undefined => {
    return getText(title.value, titleKey.value, labelText.value);
  });

  const placeholderText = computed((): string | undefined => {
    return getText(placeholder.value, placeholderKey.value, labelText.value);
  });

  return { ...pageModeProvider, pageMode, t, mode, isDisabledByEvent, titleText, placeholderText, isHiddenLabel, isDisabled, labelText };
}

//#endregion

//#region baseInput

export type BaseInputType = { validationOff: Ref<boolean>; validationProperty: Ref<string | undefined>; labelKey: Ref<string | undefined> };

export function baseInput({ validationOff, validationProperty, labelKey }: BaseInputType) {
  const validationPropertyCmp = computed((): string | undefined => {
    if (validationOff) {
      return undefined;
    }
    if (!validationProperty && !labelKey) {
      console.warn('Validation on but no validationProperty defined');
      return undefined;
    }

    return validationProperty.value || snakeToPascalCase(labelKey.value || '??');
  });
  return {
    validationPropertyCmp,
  };
}
//#endregion
