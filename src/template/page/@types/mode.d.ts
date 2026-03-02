import type { UnknownObject } from '@/template/@types/kTemplate';
import type { ComputedRef } from 'vue';
import type { PageMode } from '../providers/pageMode';

export type PgaeModeComputed = {
  pageMode: ComputedRef<PageMode>;
  isListMode: ComputedRef<boolean>;
  isSelectList: ComputedRef<boolean>;
  isCreateMode: ComputedRef<boolean>;
  isEditMode: ComputedRef<boolean>;
  isViewMode: ComputedRef<boolean>;
  isFormMode: ComputedRef<boolean>;
};
export type DropdownItem<T = number> = {
  disabled?: boolean;
  label?: string | null;
  extended?: boolean;
  text: string;
  value: T;
} & UnknownObject;
export type DropdownList<T = number> = Record<string, DropdownItem<T>[]>;
