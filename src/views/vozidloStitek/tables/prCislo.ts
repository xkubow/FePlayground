import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';
import { NAME } from '../constants';
import type { VozidloStitek } from '../type';

export const columns: Column[] = [
	{ id: 'id', i18nKey: 'id', isVisible: false },
	{ id: 'stitekKod', i18nKey: 'stitekKod', isVisible: true, width: 100, sortable: true },
	{ id: 'text', i18nKey: 'text', isVisible: true, sortable: true },
	{ id: 'vstupDatum', i18nKey: 'vstupDatum', isVisible: true, sortable: true },
	{ id: 'vyrazenoDatum', i18nKey: 'vyrazenoDatum', isVisible: true, sortable: true },
];

export const table = new Table<VozidloStitek>({
	columns,
	rows: [],
	name: NAME,
	operations: OperationFlags.CREATE | OperationFlags.EDIT,
	rowKey: 'id',
	gridId: 1,
});
