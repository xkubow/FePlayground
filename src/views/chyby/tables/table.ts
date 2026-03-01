import type { Column, Row } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { toLocale } from '@/template/utils/date';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { Detail, RowChyby } from '../type';
export type { Detail, RowChyby } from '../type';

export const detailColumns: Column[] = [
	{ id: 'rowNumber', i18nKey: 'rowNumber', isVisible: false, width: 45 },
	{ id: 'opraveno', i18nKey: 'opraveno', isVisible: true, width: 30 },
	{ id: 'selected', i18nKey: 'Selected', isVisible: false, width: 45 },
	{ id: 'pracovisteVyskytuZavady', i18nKey: 'testPlaceMin', isVisible: true, width: 120, filterable: false },
	{ id: 'PracovisteVznikuZavadyArcId', i18nKey: 'PracovisteVznikuZavadyArcId', isVisible: false, width: 120, filterable: false },
	{ id: 'stepTextId', i18nKey: 'stepTextId', isVisible: false, width: 100, filterable: false },
	{ id: 'statText', i18nKey: 'statText', isVisible: true, filterable: false },
	{ id: 'errorcodeLocation', i18nKey: 'errorcodeLocation', isVisible: true, width: 100, filterable: false },
	{
		id: 'errorcodeNr',
		i18nKey: 'errorcodeNumber',
		isVisible: true,
		width: 100,
		filterable: false,
		formatter: (row: Row, column: unknown, cellValue: unknown) => '0x' + (cellValue as number).toString(16),
	},
	{ id: 'errorcodeText', i18nKey: 'errorcodeText', isVisible: true, filterable: false },
	{ id: 'errorcodeTypeText', i18nKey: 'errorcodeType', isVisible: true, width: 100, filterable: false },
];

export const tableDetail = new Table<Detail>({
	columns: detailColumns,
	rows: [],
	name: 'chyby',
	operations: OperationFlags.DEFAULT,
	rowKey: 'rowNumber',
	selectable: true,
	gridId: 2,
});

const columns: Column[] = [
	{ id: 'rowNumber', i18nKey: 'rowNumber', isVisible: false, width: 45 },
	{ id: 'selected', i18nKey: 'Selected', isVisible: false, width: 45 },
	{ id: 'ptb', i18nKey: 'ptb', isVisible: true, width: 45, filterable: false },
	{
		id: 'diagnostickaAdresa',
		i18nKey: 'diagnostickaAdresa',
		isVisible: true,
		width: 60,
		formatter: (row: Row, column: unknown, cellValue: unknown) => ('0000' + (cellValue as number).toString(16).toUpperCase()).substr(-4),
		filterable: false,
	},
	{ id: 'ridiciJednotka', i18nKey: 'ridiciJednotka', isVisible: true, width: 150, filterable: false },
	{ id: 'ridiciJednotkaText', i18nKey: 'ridiciJednotkaText', isVisible: true, width: 250, filterable: false },
	{ id: 'pblKod', i18nKey: 'pbl', isVisible: true, width: 70, filterable: false },
	{ id: 'pblText', i18nKey: 'pblText', isVisible: true, filterable: false },
	{
		id: 'vznikZavadyDatum',
		i18nKey: 'vznikZavadyDatum',
		isVisible: true,
		width: 145,
		formatter: (row: Row, column: unknown, cellValue: unknown) => toLocale(cellValue as string),
		filterable: false,
	},
	{ id: 'opravenoVse', i18nKey: 'opraveno', isVisible: false, width: 45 },
	{ id: 'detail', i18nKey: 'detail', isVisible: true, width: 70 },
];

export const table = new Table<RowChyby>({
	columns,
	rows: [],
	name: 'chyby',
	operations: OperationFlags.DEFAULT,
	rowKey: 'rowNumber',
	selectable: true,
	gridId: 1,
	filterMapper: (payload) => ({ knr: payload.serverData.knr }),
});
