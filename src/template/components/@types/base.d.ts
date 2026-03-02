import type { T } from '@/template/i18n/type';
import type { PgaeModeComputed } from '@/template/page/@types/mode';
import type { ComputedRef } from 'vue';

export type Base = {
  placeholderText: ComputedRef<string | undefined>;
  t: T;
  isDisabledByEvent: Ref<boolean> | undefined;
  titleText: ComputedRef<string | undefined>;
  isHiddenLabel: ComputedRef<boolean>;
  isDisabled: ComputedRef<boolean>;
  labelText: ComputedRef<string>;
} & PgaeModeComputed;
