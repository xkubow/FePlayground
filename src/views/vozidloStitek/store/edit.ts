import { Table } from '@/template/components/table';
import { Page } from '@/template/page/@types/page';
import type { ActionOptions, PageStore } from '@/template/page/@types/store';
import { editName } from '@/template/page/constants';
import { pageStoreFactory } from '@/template/page/store';
import { dataMapper } from '@/template/utils/dataMapper';
import { OperationFlags } from '@/template/utils/operationFlags';
import { table as prCislo } from '@/views/ciselniky/prCislo/tables';
import type { PrCislo } from '@/views/ciselniky/prCislo/types';
import _ from 'lodash';
import type { _GettersTree } from 'pinia';
import { apiProvider } from '../api';
import { NAME } from '../constants';
import type { VozidloStitek } from '../type';

export const server = {
  id: null as number | null,
  stitekKod: null as string | null,
  text: null as string | null,
  vstupDatum: null as Date | null,
  vyrazenoDatum: null as Date | null,
};
export const local = {};
export const props = {};

export const tables = {
  prCislo: new Table<PrCislo>({
    ...prCislo,
    loadByEntityId: true,
    operations: OperationFlags.DELETE,
    filterMapper: (payload) => ({ vozidloStitekId: payload.serverData.id, vozidloStitekIdIn: true }),
  }),
};

const name = editName(NAME);

const page = new Page(name, server, local, props, tables);

export type PageType = typeof page;

const extraGetters: _GettersTree<PageType> = {};

const extraActions = {
  async loadEntity(params: { id: string | number }) {
    const response = await apiProvider?.loadEntity<VozidloStitek>(params.id);
    const entity = _.last(this.entity);
    entity && response?.data && dataMapper(entity.serverData, response?.data);
    return response;
  },
} as ActionOptions<typeof name, typeof server, typeof local, typeof props, typeof tables>;

export type N = typeof name;
export type S = typeof server;
export type L = typeof local;
export type P = typeof props;
export type T = typeof tables;
export type G = typeof extraGetters;
export type A = typeof extraActions;

export type PageStoreVS = PageStore<S, L, P, T, A, G>;

export const useStore = pageStoreFactory({
  name,
  apiProvider,
  page,
  extraGetters,
  extraActions,
});
