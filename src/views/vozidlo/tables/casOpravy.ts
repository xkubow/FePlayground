import type { Column, Row } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { actualDateFormat, actualLocale } from '@/template/utils/date';
import { OperationFlags } from '@/template/utils/operationFlags';
import dayjs from 'dayjs';


export type CasOpravy = {
	id: number;
	casZacatek: Date;
	dobaOpravyMinuty: number;
	opravilZobrazeneJmeno: string | null;
	sqsZavadaMistoText: string | null;
	sqsZavadaTypText: string | null;
	sqsZavadaVinikText: string | null;
	text: string | null;
};

export const columns: Column[] = [
	{ id: 'id', i18nKey: 'id', isVisible: false, sortable: false },
	{
		id: 'casZacatek',
		i18nKey: 'casZacatek',
		isVisible: true,
		formatter: (row: Row, column: unknown, cellValue: unknown) => {
			const fromDate = dayjs(new Date(cellValue as string));
			const to = fromDate.add((row as CasOpravy).dobaOpravyMinuty ?? 0, "minute");
			return `${fromDate.format(actualDateFormat)} - ${to.format(actualDateFormat)}`;
		},
		width: 250
	},
	{ id: 'dobaOpravyMinuty', i18nKey: 'dobaOpravyMinuty', isVisible: true, sortable: true },
	{ id: 'sqsZavadaMistoText', i18nKey: 'sqsZavadaMistoText', isVisible: true, sortable: true },
    { id: 'sqsZavadaTypText', i18nKey: 'sqsZavadaTypText', isVisible: true, sortable: true },
    { id: 'sqsZavadaVinikText', i18nKey: 'sqsZavadaVinikText', isVisible: true, sortable: true },
    { id: 'text', i18nKey: 'text', isVisible: true, sortable: true },
	{ id: 'opravilZobrazeneJmeno', i18nKey: 'opravilZobrazeneJmeno', isVisible: true, sortable: true },
];

export const table = new Table<CasOpravy>({
	columns,
	rows: [],
	name: 'casOpravy',
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
	filterMapper: (payload) => ({ knr: payload.serverData.knr ?? -1 })
});
