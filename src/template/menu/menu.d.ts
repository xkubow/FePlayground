import type { ComputedRef } from 'vue';
import { MenuType, UriType } from './constants';

export type MenuItem = {
  i18nKey?: string;
  text?: string;
  menuType?: MenuType;
  items?: MenuItem[];
  uriType?: UriType;
  to?: string | (() => string);
  id?: number;
  dynamicValue?: ComputedRef<string | null>;
};

export type Menu = {
  items: MenuItem[];
};
