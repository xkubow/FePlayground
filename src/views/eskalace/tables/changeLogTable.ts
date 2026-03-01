import type { Column, Row } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';

export type ChangeLogRow = {
	rowNumber: number;
	vstupDatum: Date;
	vstupUzivatelId: string;
	zobrazeneJmeno: string;
	entityName: string;
	entityId: string;
	statementTypeEnum: number;
	columns: [
		{
			name: string;
			oldValue: string;
			newValue: string;
		},
	];
	text: string;
	knr: number;
};

export const columns: Column[] = [];

export const ChangeLogTable = new Table<ChangeLogRow>({
	columns,
	rows: [],
	name: 'ChangeLog',
	operations: OperationFlags.DEFAULT,
	rowKey: 'rowNumber',
	gridId: 1,
});
