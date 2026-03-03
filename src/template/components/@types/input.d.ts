import type { UnknownObject } from '@/template/@types/kTemplate';

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

// BUG https://github.com/vuejs/core/issues/4294
 
export interface IBaseProps extends BaseProps {}

export type BaseProps = {
  span?: number;
  sm?: number;
  xs?: number;
  disabled?: boolean;
  title?: string;
  titleKey?: string;
  labelKey?: string;
  placeholder?: string;
  placeholderKey?: string;
  label?: string;
  labelKeySuffix?: string;
  showLabel?: boolean;
  overwriteHiddenLabel?: boolean;
};

 
export interface IBaseInputProps extends BaseInputProps {}

export type BaseInputProps = {
  validationProperty?: string;
  validationRules?: Record<string, unknown> | Array<unknown>;
  validationOff?: boolean;
  clearable?: boolean;
  uppercase?: boolean;
  wrapp?: boolean;
  required?: boolean;
  noLabelAlign?: boolean;
  modelValue?: number | object | string | Array | boolean;
  wrappClass?: string | UnknownObject;
  modelModifiers?: UnknownObject & { number?: boolean };
} & BaseProps;
