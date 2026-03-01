import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';

export type Row = {
	rowNumber: number;
	testId: number;
	ridiciJednotkaId: number;
	sNr: string;
	swVersion: number;
	hwVersion: string;
	ndNr: string;
	hwNdNr: string;
	dl24: string;
	vis: string;
	bzdSNr: string;
	zdc: string;
};

const columns: Column[] = [
	{ id: 'sNr', i18nKey: 'sNr', isVisible: true, width: 70 },
	{ id: 'swVersion', i18nKey: 'swVersion', isVisible: true, width: 110 },
	{ id: 'hwVersion', i18nKey: 'hwVersion', isVisible: true, width: 140 },
	{ id: 'ndNr', i18nKey: 'ndNr', isVisible: true, width: 70 },
	{ id: 'hwNdNr', i18nKey: 'hwNdNr', isVisible: true, width: 200 },
	{ id: 'dl24', i18nKey: 'dl24', isVisible: true, width: 70 },
	{ id: 'vis', i18nKey: 'vis', isVisible: true, width: 200 },
	{ id: 'bzdSNr', i18nKey: 'bzdSNr', isVisible: true, width: 90 },
	{ id: 'zdc', i18nKey: 'zdc', isVisible: true, width: 90 },
];

export const table = new Table<Row>({
	columns,
	rows: [],
	name: 'ridiciJednotkaInfo',
	operations: OperationFlags.DEFAULT,
	rowKey: 'rowNumber',
	selectable: true,
	gridId: 1,
	filterMapper: (payload) => ({ knr: payload.serverData.knr, testId: payload.serverData.testId }),
});
