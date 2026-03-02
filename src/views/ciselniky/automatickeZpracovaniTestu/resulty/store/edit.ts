import { Page } from '@/template/page/@types/page';
import type { ActionOptions } from '@/template/page/@types/store';
import { editName } from '@/template/page/constants';
import { pageStoreFactory } from '@/template/page/store';
import type { _GettersTree } from 'pinia';
import { apiProvider } from '../api';
import { NAME } from '../constants';
import type { EnumAutomatickeZpracovaniTestu } from '../type';

export const server = {
  id: null as number | null,
  automatickeZpracovaniTestuEnum: null as EnumAutomatickeZpracovaniTestu | null,
  pblKod: null as number | null,
  text: null as string | null,
  vyrobniLinkaId: null as number | null,
};
export const local = {};
export const props = {};

export const tables = {};

const name = editName(NAME);

const page = new Page(name, server, local, props, tables);

export type PageType = typeof page;

const extraGetters: _GettersTree<PageType> = {};

const extraActions = {} as ActionOptions<typeof name, typeof server, typeof local, typeof props, typeof tables>;

export const useStore = pageStoreFactory({
  name,
  apiProvider,
  page,
  extraGetters,
  extraActions,
});
