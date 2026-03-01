import type { Column, Row } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { actualLocale } from '@/template/utils/date';
import { OperationFlags } from '@/template/utils/operationFlags';

export type RowZavada = {
	id: number;
	opravenoDatum: Date;
	vyrazenoDatum: Date;
	pracovisteVznikuZavadyText: string;
	pracovisteZadaniZavadyText: string;
	sqsZavadaMistoText: string;
	sqsZavadaTypText: string;
	sqsZavadaVinikText: string;
	text: string;
	vstupUzivatelZobrazeneJmeno: string;
	operations?: number;
	dobaOpravyMinuty?: number;
};

export const columns: Column[] = [
	{ id: 'id', i18nKey: 'id', isVisible: false, width: 47 },
	{
		id: 'opravenoDatum',
		i18nKey: 'opravenoDatum',
		isVisible: true,
		width: 80,
		align: 'center',
	},
	{
		id: 'vyrazenoDatum',
		i18nKey: 'vyrazenoDatum',
		isVisible: false,
		width: 150,
		formatter: (row: Row, column: unknown, cellValue: unknown, index: number) => {
			return row.opravenoDatum ? new Date(row.opravenoDatum as string).toLocaleDateString(actualLocale) : '';
		},
	},
	{ id: 'pracovisteVznikuZavadyText', i18nKey: 'pracovisteVznikuZavadyText', isVisible: true, width: 150 },
	{ id: 'pracovisteZadaniZavadyText', i18nKey: 'pracovisteZadaniZavadyText', isVisible: true, width: 150 },
	{ id: 'sqsZavadaMistoText', i18nKey: 'sqsZavadaMistoText', isVisible: true, width: 150 },
	{ id: 'sqsZavadaTypText', i18nKey: 'sqsZavadaTypText', isVisible: true, width: 150 },
	{ id: 'sqsZavadaVinikText', i18nKey: 'sqsZavadaVinikText', isVisible: true, width: 150 },
	{ id: 'text', i18nKey: 'text', isVisible: true },
	{ id: 'vstupUzivatelZobrazeneJmeno', i18nKey: 'opravil', isVisible: true, width: 150 },
	{ id: 'dobaOpravyMinuty', i18nKey: 'dobaOpravyMinuty', isVisible: true, width: 150 },
	{ id: 'operations', i18nKey: 'operations', isVisible: false },
];

export const table = new Table<RowZavada>({
	columns,
	rows: [],
	name: 'zavady',
	operations: OperationFlags.EDIT,
	rowKey: 'id',
	gridId: 1,
	filterMapper: (payload) => ({ knr: payload.serverData.knr ?? -1 })
});
