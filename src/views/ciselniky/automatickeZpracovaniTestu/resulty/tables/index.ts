import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { AutomatickeZpracovaniTestuResulty } from '../type';

export const columns: Column[] = [
	{ id: 'id', i18nKey: 'ID', isVisible: false },
	{ id: 'automatickeZpracovaniTestuEnum', i18nKey: 'automatickeZpracovaniTestuEnum', isVisible: false },
	{ id: 'pblKod', i18nKey: 'pblKod', width: 100, isVisible: true, sortable: true },
	{ id: 'text', i18nKey: 'text', isVisible: true, sortable: true },
	{ id: 'vyrobniLinkaId', i18nKey: 'vyrobniLinkaId', isVisible: false, sortable: false },
];

export const table = new Table<AutomatickeZpracovaniTestuResulty>({
	columns,
	rows: [],
	name: 'automatickeZpracovaniTestuResulty',
	operations: OperationFlags.EDIT,
	rowKey: 'id',
	gridId: 1,
});
