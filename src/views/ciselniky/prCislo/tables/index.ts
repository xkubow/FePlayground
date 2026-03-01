import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { PrCislo } from '../types';

const filter = {
	prCisloKod: null as string | null,
	prCisloText: null as string | null,
	prRodinaKod: null as string | null,
	prRodinaText: null as string | null,
};

export type Filter = typeof filter;

export const columns: Column[] = [
	{ id: 'prCisloKod', i18nKey: 'prCisloKod', isVisible: true, width: 100, align: 'right', filterable: true, sortable: true },
	{ id: 'prCisloText', i18nKey: 'prCisloText', isVisible: true, filterable: true, sortable: true },
	{ id: 'prRodinaKod', i18nKey: 'prRodinaKod', isVisible: true, width: 100, align: 'right', filterable: true, sortable: true },
	{ id: 'prRodinaText', i18nKey: 'prRodinaText', isVisible: true, filterable: true, sortable: true },
];

export const table = new Table<PrCislo, Filter>({
	filter,
	columns,
	rows: [],
	name: 'prCislo',
	operations: OperationFlags.DEFAULT,
	rowKey: 'prCisloKod',
	gridId: 1,
	paging: {
		currentPage: 1,
		pageSize: 20,
		skip: 0,
		backCache: 20,
		count: 200,
	},
	filterMapper: (payload) => ({ knr: payload.serverData.knr ?? -1 })
});
