import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';

export type RowTiket = {
	//
};

export const columns: Column[] = [];

export const table = new Table<RowTiket>({
	columns,
	rows: [],
	name: 'tiket',
	operations: OperationFlags.EDIT,
	rowKey: 'id',
	gridId: 1,
	paging: {
		currentPage: 1,
		pageSize: 20,
		skip: 0,
		backCache: 20,
		count: 200,
	},
});
