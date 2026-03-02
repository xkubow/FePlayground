import { Page } from '@/template/page/@types/page';
import type { ActionOptions } from '@/template/page/@types/store';
import { editName } from '@/template/page/constants';
import { pageStoreFactory } from '@/template/page/store';
import type { _GettersTree } from 'pinia';
import { apiProvider } from '../api';
import { EnumSqsZavadaKategorie, NAME } from '../constants';
import type { EnumAutomatickeZpracovaniTestu } from '../resulty/type';
import { table as resultyTable } from '../resulty/tables';

export const server = {
  automatickeZpracovaniTestuEnum: null as EnumAutomatickeZpracovaniTestu | null,
  text: null as string | null,
  definiceZavadyId: null as number | null,
  sqsZavadaKategorieId: EnumSqsZavadaKategorie.Elektricka as number | null,
  sqsZavadaSkupinaId: null as number | null,
  sqsZavadaRadekId: null as number | null,
  sqsZavadaTypId: null as number | null,
  sqsZavadaVinikId: null as number | null,
  zavadaText: null as string | null,
};
export const local = {};
export const props = {};

export const tables = {
  resulty: resultyTable,
};

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
