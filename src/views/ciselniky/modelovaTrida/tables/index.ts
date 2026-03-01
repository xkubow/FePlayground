import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { ModelovaTrida } from '../type';

export const columns: Column[] = [
	{ id: 'modelovaTridaKod', i18nKey: 'modelovaTridaKod', isVisible: true, width: 100, sortable: true },
	{ id: 'text', i18nKey: 'text', isVisible: true, sortable: true },
];

export const table = new Table<ModelovaTrida>({
	columns,
	rows: [],
	name: 'modelovaTrida',
	operations: OperationFlags.EDIT,
	rowKey: 'modelovaTridaKod',
	gridId: 1,
});
