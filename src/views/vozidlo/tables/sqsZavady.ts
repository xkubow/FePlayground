import type { Column, Row } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { actualLocale } from '@/template/utils/date';
import { OperationFlags } from '@/template/utils/operationFlags';

export type Sqs = {
	sqsZavadaRadekId: number;
	sqsZavadaMistoText: string;
	sqsZavadaTypText: string;
	sqsZavadaVinikText: string;
	status: boolean;
	vstupUzivatelText: string;
	vstupDatum: Date;
};

export const columns: Column[] = [
	{ id: 'sqsZavadaRadekId', i18nKey: 'sqsZavadaRadekId', isVisible: false },
	{ id: 'sqsZavadaMistoText', i18nKey: 'sqsZavadaMistoText', isVisible: true },
	{ id: 'sqsZavadaTypText', i18nKey: 'sqsZavadaTypText', isVisible: true },
	{ id: 'sqsZavadaVinikText', i18nKey: 'sqsZavadaVinikText', isVisible: true },
	{ id: 'status', i18nKey: 'status', isVisible: true },
	{ id: 'vstupUzivatelText', i18nKey: 'vstupUzivatelText', isVisible: true },
	{
		id: 'vstupDatum',
		i18nKey: 'vstupDatum',
		isVisible: true,
		formatter: (row: Row, column: unknown, cellValue: unknown) => (cellValue ? new Date(cellValue as string).toLocaleString(actualLocale) : ''),
	},
];

export const table = new Table<Sqs>({
	columns,
	rows: [],
	name: 'sqs',
	operations: OperationFlags.DEFAULT,
	rowKey: 'sqsZavadaRadekId',
	gridId: 1,
	filterMapper: (payload) => ({ knr: payload.serverData.knr ?? -1 })
});
