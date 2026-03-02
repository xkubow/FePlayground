import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { toLocaleDate } from '@/template/utils/date';
import type { Komentar } from '../type';

const columns: Column[] = [
  { id: 'id', i18nKey: 'id', isVisible: false, width: 45 },
  { id: 'text', i18nKey: 'Selected', isVisible: true },
  { id: 'vstupDatum', i18nKey: 'vstupDatum', isVisible: true, width: 70, formatter: (val: unknown) => toLocaleDate(val as string) },
];

export const table = new Table<Komentar>({
  columns,
  rows: [],
  name: 'komentare',
  operations: 0,
  rowKey: 'id',
  selectable: false,
  gridId: 1,
});
