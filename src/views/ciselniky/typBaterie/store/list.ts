import { Page } from '@/template/page/@types/page';
import type { ActionOptions, PageActionsGlobal, PageGetters } from '@/template/page/@types/store';
import { listName } from '@/template/page/constants';
import { pageStoreFactory } from '@/template/page/store';
import { apiProvider } from '../api';
import { NAME } from '../constants';
import { table } from '../tables';

export const server = {};

export const local = {};

export const props = {};

export const tables = {
  table,
};

type Server = typeof server;
type Local = typeof local;
type Props = typeof props;
type Tables = typeof tables;

type ExtraActions = { loadOnLinkaChange(): Promise<void> } & PageActionsGlobal<Server, Local, Props, Tables>;
type ExtraGetters = PageGetters<Server, Local, Props, Tables>;

const extraActions = {
  // async filter(filter: Record<string, unknown>) {
  // 	if (!this.last) return;
  // 	const respontModelovaTridaKod = await apiProvider.getDropDownList();
  // 	this.last.localData.dropDownList.modelovaTridaKod = respontModelovaTridaKod?.data ?? [];
  // },
} as ActionOptions<typeof name, Server, Local, Props, Tables, ExtraGetters, ExtraActions>;

const name = listName(NAME);

const page = new Page(name, server, local, props, tables);

export const useStore = pageStoreFactory({
  name,
  apiProvider,
  page,
  extraGetters: {},
  extraActions,
});
