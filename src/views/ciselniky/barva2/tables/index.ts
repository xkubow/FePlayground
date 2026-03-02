import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { Barva } from '../type';

export const columns: Column[] = [
  { id: 'barva2Kod', i18nKey: 'barva2Kod', isVisible: true, width: 100, sortable: true },
  { id: 'uiBarvaKod', i18nKey: 'uiBarvaKod', isVisible: true, width: 100, sortable: true },
  { id: 'text', i18nKey: 'text', isVisible: true, sortable: true },
];

export const table = new Table<Barva>({
  columns,
  rows: [],
  name: 'barva2',
  operations: OperationFlags.EDIT,
  rowKey: 'barva2Kod',
  gridId: 1,
});
