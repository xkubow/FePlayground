import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { Barva } from '../type';

export const columns: Column[] = [
	{ id: 'modelovaSkupinaKod', i18nKey: 'modelovaSkupinaKod', isVisible: true, width: 100, sortable: true },
	{ id: 'text', i18nKey: 'text', isVisible: true, sortable: true },
];

export const table = new Table<Barva>({
	columns,
	rows: [],
	name: 'modelovaSkupina',
	operations: OperationFlags.EDIT,
	rowKey: 'modelovaSkupinaKod',
	gridId: 1,
});
