export type Label = {
  id: number;
  barva2Kod: string;
  jazykId: number;
  jazykPopis: string;
  text: string;
};

import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';

export const columns: Column[] = [
  { id: 'id', i18nKey: 'id', isVisible: false, width: 100 },
  { id: 'jazykPopis', i18nKey: 'jazykPopis', isVisible: true, width: 100 },
  { id: 'jazykId', i18nKey: 'jazykId', isVisible: false, width: 100 },
  { id: 'text', i18nKey: 'text', isVisible: true },
];

export const table = new Table<Label>({
  columns,
  rows: [],
  name: 'barva2Label',
  operations: OperationFlags.DEFAULT,
  rowKey: 'id',
  gridId: 1,
});
