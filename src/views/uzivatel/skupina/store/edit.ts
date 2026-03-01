import { Table } from '@/template/components/table';
import { Page } from '@/template/page/@types/page';
import type { ActionOptions } from '@/template/page/@types/store';
import { editName } from '@/template/page/constants';
import { pageStoreFactory } from '@/template/page/store';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { _GettersTree } from 'pinia';
import { table } from '../../tables';
import type { Uzivatel } from '../../type';
import { apiProvider } from '../api';
import { NAME } from '../constants';

table.operations = OperationFlags.DELETE;

export const server = {
	id: null as number | null,
	text: null as string | null,
	skupinaUzivateluTypEnum: null as number | null,
	vyrobniLinkaId: null as number | null,
};
export const local = {};
export const props = {};

export const tables = {
	uzivatel: new Table<Uzivatel>({ ...table, filterMapper: (payload) => ({ SkupinaUzivateluId: payload.serverData.id ?? -1, SkupinaUzivateluIdIn: true }) }),
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
