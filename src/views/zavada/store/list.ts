import { Page } from '@/template/page/@types/page';
import { listName, STORE_TABLE } from '@/template/page/constants';
import { pageStoreFactory } from '@/template/page/store';
import { apiProvider } from '../api';
import { NAME } from '../constants';
import { table } from '../tables/table';

export const server = {};

export const local = {};

export const props = {};

export const tables = {
	[STORE_TABLE]: table,
};

const name = listName(NAME);

const page = new Page(name, server, local, props, tables);

export const useStore = pageStoreFactory({
	name,
	apiProvider,
	page,
	extraGetters: {},
	extraActions: {},
});
