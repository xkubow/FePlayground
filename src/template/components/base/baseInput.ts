import { snakeToPascalCase } from '@/template/utils/stringHelper';
import { computed, type EmitFn, type SlotsType, type ToRefs } from 'vue';
import type { BaseInputProps } from '../@types/input';
import { baseProps, useBase } from './base';

type ModelValueEmitType = Record<'update:modelValue', ((...args: any[]) => any) | null>;

export const baseInputProps = {
  ...baseProps,
  validationProperty: String,
  validationRules: [Object, Array],
  validationOff: Boolean,
  clearable: { type: Boolean, default: true },
  wrapp: { type: Boolean, default: true },
  required: Boolean,
  noLabelAlign: Boolean,
  uppercase: Boolean,
  modelValue: { type: [Number, Object, String, Array, Boolean] },
  wrappClass: [String, Object],
  modelModifiers: { default: () => ({}) },
};

export function baseInput<P extends ToRefs<BaseInputProps>, E extends EmitFn<ModelValueEmitType>>(props: P, emit: E) {
  const baseData = useBase(props);
  const validationPropertyCmp = computed((): string | undefined | null => {
    if (props.validationOff?.value) {
      return undefined;
    }
    if (!props.validationProperty?.value && !props.labelKey?.value) {
      console.warn('Validation on but no validationProperty defined');
      return undefined;
    }
    return props.validationProperty?.value || props.labelKey?.value || '??';
  });

  const vmodel = computed({
    get() {
      return props.modelValue?.value;
    },
    set(val) {
      let theVal = val;
      if (props.uppercase?.value && typeof val === 'string') theVal = val.toUpperCase();
      else if (props.modelModifiers?.value?.number) {
        theVal = parseInt(val as string);
        theVal = isNaN(theVal as any) ? null : theVal;
      }

      emit('update:modelValue', theVal);
    },
  });

  return {
    ...baseData,
    validationPropertyCmp,
    vmodel,
  };
}
