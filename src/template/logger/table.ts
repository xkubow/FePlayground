import { Table } from '@/template/components/table';
import type { AxiosError } from 'axios';
import type { Column } from '../components/table/@types/table';
import { OperationFlags } from '../utils/operationFlags';
import type { LogLevel } from './constants';

const columns: Column[] = [
	{ id: 'message', i18nKey: 'message', isVisible: true, width: 350 },
	{ id: 'type', i18nKey: 'type', isVisible: true, width: 45 },
	{ id: 'httpError', i18nKey: 'httpError', isVisible: true },
];

export type RowError = {
	message: string;
	type: LogLevel;
	httpError?: AxiosError;
};

export const table = new Table<RowError>({
	columns,
	rows: [],
	name: 'errors',
	operations: OperationFlags.DEFAULT,
	rowKey: 'rowNumber',
	gridId: 1,
});
