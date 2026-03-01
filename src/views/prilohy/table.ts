import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { toLocaleDate } from '@/template/utils/date';
import type { Priloha } from './type';

const columns: Column[] = [
	{ id: 'id', i18nKey: 'id', isVisible: false, width: 45 },
	{ id: 'celyNazev', i18nKey: 'celyNazev', isVisible: true },
	{ id: 'velikost', i18nKey: 'velikost', isVisible: true, width: 70, formatter: (val: unknown) => toLocaleDate(val as string) },
];

export type TablePriloha = Table<Priloha>;
export const table = new Table<Priloha>({
	columns,
	rows: [],
	name: 'prilohy',
	operations: 0,
	rowKey: 'id',
	selectable: false,
	gridId: 1,
});
