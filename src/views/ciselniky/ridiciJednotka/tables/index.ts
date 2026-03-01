import type { Column, Row } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { RidiciJednotka } from '../type';

export const columns: Column[] = [
	{
		id: 'diagnostickaAdresa',
		i18nKey: 'diagnostickaAdresa',
		isVisible: true,
		width: 100,
		sortable: true,
		formatter: (row: Row, column: unknown, cellValue: unknown) => ('0000' + (cellValue as number).toString(16).toUpperCase()).substr(-4),
	},
	{ id: 'ridiciJednotkaText', i18nKey: 'ridiciJednotkaText', isVisible: true, width: 100, sortable: true },
	{ id: 'text', i18nKey: 'text', isVisible: true, sortable: true },
];

export const table = new Table<RidiciJednotka>({
	columns,
	rows: [],
	name: 'ridiciJednotka',
	operations: OperationFlags.EDIT,
	rowKey: 'id',
	gridId: 1,
});
