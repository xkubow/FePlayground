import type { MenuItem } from '@/template/menu/menu.d';

export type InstallOptions = {
  routes: Array<RouteRecordRaw>;
  menu: MenuItem[];
};

export type EmptyObject = Record<string, never>;
export type UnknownObject = Record<string, unknown>;
