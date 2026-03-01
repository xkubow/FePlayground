import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { Blikacka } from '../type';

export const columns: Column[] = [];

export const table = new Table<Blikacka>({
	columns,
	rows: [],
	name: 'blikacka',
	operations: OperationFlags.DEFAULT,
	rowKey: 'knr',
	gridId: 1,
});
