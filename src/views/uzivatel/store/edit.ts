import { Page } from '@/template/page/@types/page';
import type { ActionOptions } from '@/template/page/@types/store';
import { editName } from '@/template/page/constants';
import { pageStoreFactory } from '@/template/page/store';
import type { _GettersTree } from 'pinia';
import { apiProvider } from '../api';
import { NAME } from '../constants';

export const server = {
  id: null as string | null,
  dzc: null as string | null,
  mfaPerNr: null as string | null,
  jmeno: null as string | null,
  prijmeni: null as string | null,
  zobrazeneJmeno: null as string | null,
  oddeleni: null as string | null,
  email: null as string | null,
  vstupDatum: null as Date | null,
  vyrazenDatum: null as Date | null,
  vyrobniLinkaId: null as number | null,
  station: false,
  neovereno: false,
  zkusenost: null as number | null,
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
