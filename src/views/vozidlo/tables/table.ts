import type { Column, Row } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { actualLocale } from '@/template/utils/date';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { EnumStatusIo } from '@/views/chyby/constants';

export type RowVozidlo = {
	knr: number;
	vin: string;
	linka: string;
	modelovyKlicKod: string;
	modelText: string;
	vstupDatum: string;
	editDatum: string;
	vyrobaDatum: string;
	statusIoEnum: EnumStatusIo;
};

export const columns: Column[] = [
	{ id: 'knr', i18nKey: 'knr', isVisible: true, sortable: true },
	{ id: 'vin', i18nKey: 'vin', isVisible: true, sortable: true },
	{ id: 'linka', i18nKey: 'linka', isVisible: true, sortable: true },
	{ id: 'modelovyKlicKod', i18nKey: 'modelovyKlicKod', isVisible: true, sortable: true },
	{ id: 'modelText', i18nKey: 'modelText', isVisible: true, sortable: true },
	{
		id: 'vstupDatum',
		i18nKey: 'vstupDatum',
		isVisible: false,
		formatter: (row: Row, column: unknown, cellValue: unknown) => (cellValue ? new Date(cellValue as string).toLocaleDateString(actualLocale) : ''),
	},
	{
		id: 'editDatum',
		i18nKey: 'editDatum',
		isVisible: true,
		formatter: (row: Row, column: unknown, cellValue: unknown) => (cellValue ? new Date(cellValue as string).toLocaleString(actualLocale) : ''),
		sortable: true,
	},
	{
		id: 'vyrobaDatum',
		i18nKey: 'vyrobaDatum',
		isVisible: true,
		formatter: (row: Row, column: unknown, cellValue: unknown) => (cellValue ? new Date(cellValue as string).toLocaleString(actualLocale) : ''),
		sortingIndex: 1,
		sortingAscending: false,
		sortable: true,
	},
	{ id: 'statusIoEnum', i18nKey: 'testIo', isVisible: false },
];

export const table = new Table<RowVozidlo>({
	columns,
	rows: [],
	name: 'vozidla',
	operations: OperationFlags.EDIT,
	rowKey: 'knr',
	gridId: 1,
	paging: {
		currentPage: 1,
		pageSize: 20,
		skip: 0,
		backCache: 20,
		count: 200,
	},
});
