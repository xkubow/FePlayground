import type { Column, Row } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';
import { actualLocale } from '@/template/utils/date';

export type RowEskalace = {
	eskalaceStatusEnum: number;
	eskalaceStatusText: string;
	knr: number;
	modelovyKlicKod: string;
	prirazenaSkupinaUzivateluZobrazeneJmeno: string;
	ridiciJednotkaDiagnostickaAdresa: number;
	ridiciJednotkaLabelText: string;
	ridiciJednotkaText: string;
	schvaleniDatum: Date;
	text: string;
};

export const columns: Column[] = [
	{ id: 'id', i18nKey: 'id', isVisible: false },
	{ id: 'eskalaceStatusEnum', i18nKey: 'eskalaceStatusEnum', isVisible: false },
	{ id: 'eskalaceStatusText', i18nKey: 'eskalaceStatusText', isVisible: true, width: 100, sortable: true },
	{ id: 'knr', i18nKey: 'knr', isVisible: true, width: 130, sortable: true },
	{
		id: 'ridiciJednotkaDiagnostickaAdresa',
		i18nKey: 'diagnostickaAdresa',
		isVisible: true,
		width: 60,
		formatter: (row: Row, column: unknown, cellValue: unknown) => ('0000' + (cellValue as number).toString(16).toUpperCase()).substr(-4),
		sortable: true,
	},
	{ id: 'ridiciJednotkaText', i18nKey: 'ridiciJednotkaText', isVisible: true, width: 70, sortable: true },
	{ id: 'ridiciJednotkaLabelText', i18nKey: 'ridiciJednotkaLabelText', isVisible: true, sortable: true },
	{ id: 'modelovyKlicKod', i18nKey: 'modelovyKlicKod', isVisible: true, width: 100, sortable: true },
	{ id: 'prirazenaSkupinaUzivateluZobrazeneJmeno', i18nKey: 'prirazenaSkupinaUzivateluZobrazeneJmeno', isVisible: true, width: 100, sortable: true },
	{
		id: 'schvaleniDatum',
		i18nKey: 'schvaleniDatum',
		isVisible: true,
		width: 135,
		formatter: (row: Row, column: unknown, cellValue: unknown) => (cellValue ? new Date(cellValue as string).toLocaleString(actualLocale) : ''),
		sortable: true,
	},
	{ id: 'text', i18nKey: 'text', isVisible: true, sortable: true },
];

export const table = new Table<RowEskalace>({
	columns,
	rows: [],
	name: 'eskalace',
	operations: OperationFlags.DEFAULT,
	rowKey: 'id',
	gridId: 1,
});
