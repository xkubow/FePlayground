import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { TypBaterie } from '../type';

export const columns: Column[] = [
	{ id: 'id', i18nKey: 'id', isVisible: false, width: 100, sortable: false },
	{ id: 'text', i18nKey: 'text', isVisible: true, sortable: true },
	{ id: 'poznamka', i18nKey: 'poznamka', isVisible: true, sortable: true },
];

export const table = new Table<TypBaterie>({
	columns,
	rows: [],
	name: 'typBaterie',
	operations: OperationFlags.EDIT,
	rowKey: 'id',
	gridId: 1,
});
