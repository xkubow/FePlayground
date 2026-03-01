import type { Column, Row } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { roundTo } from '@/template/utils/math';
import { OperationFlags } from '@/template/utils/operationFlags';

export const NAME = 'navrhovane';

export type NavrhovaneZavadyDetail = {
	rowNumber: number;
	probability: number;
	sqsZavadaTypId: number;
	sqsZavadaTypText: string;
	sqsZavadaVinikId: number;
	sqsZavadaVinikText: string;
	pocetZavad: number;
	selected: boolean;
};

export const columnsDetail: Column[] = [
	{ id: 'rowNumber', i18nKey: 'rowNumber', isVisible: false },
	{
		id: 'probability',
		i18nKey: 'probability',
		isVisible: true,
		width: 150,
		align: 'right',
		formatter: (row: Row, column: unknown, cellValue: unknown, index: number) => {
			let percent = row.probability as number;
			if (!percent) return '0';
			percent = roundTo(percent * 100, 2);
			return `${percent} %`;
		},
	},
	{ id: 'sqsZavadaTypId', i18nKey: 'sqsZavadaTypId', isVisible: false },
	{ id: 'sqsZavadaTypText', i18nKey: 'sqsZavadaTypText', isVisible: true },
	{ id: 'sqsZavadaVinikId', i18nKey: 'sqsZavadaVinikId', isVisible: false },
	{ id: 'sqsZavadaVinikText', i18nKey: 'sqsZavadaVinikText', isVisible: true },
	{ id: 'pocetZavad', i18nKey: 'pocetZavad', isVisible: true },
];

export type NavrhovaneZavady = {
	definiceZavadyId: number;
	sqsZavadaMistoText: string;
	probability: number;
	sqsZavadaSkupinaId: number;
	sqsZavadaMistoId: number;
	sqsZavadaRadekId: number;
	sqsZavadaSkupinaText: string;
	zpusobOpravy: string;
	detail: NavrhovaneZavadyDetail[];
};

export const columns: Column[] = [
	{ id: 'definiceZavadyId', i18nKey: 'definiceZavadyId', isVisible: false },
	{
		id: 'probability',
		i18nKey: 'probability',
		isVisible: true,
		width: 150,
		align: 'right',
		formatter: (row: Row, column: unknown, cellValue: unknown, index: number) => {
			let percent = row.probability as number;
			if (!percent) return '0';
			percent = roundTo(percent * 100, 2);
			return `${percent} %`;
		},
	},
	{ id: 'sqsZavadaMistoText', i18nKey: 'sqsZavadaMistoText', isVisible: true, width: 400 },
	{ id: 'sqsZavadaMistoId', i18nKey: 'sqsZavadaMistoId', isVisible: false, width: 250 },
	{ id: 'sqsZavadaSkupinaText', i18nKey: 'sqsZavadaSkupinaText', isVisible: true, width: 250 },
	{ id: 'zpusobOpravy', i18nKey: 'zpusobOpravy', isVisible: true },
	{ id: 'detail', i18nKey: 'detail', isVisible: true, width: 70 },
];

export const table = new Table<NavrhovaneZavady>({
	columns,
	rows: [],
	name: 'navrhovaneZavady',
	operations: OperationFlags.DEFAULT,
	rowKey: 'definiceZavadyId',
	gridId: 1,
	filterMapper: (payload) => ({ knr: payload.serverData.knr ?? -1 })
});
