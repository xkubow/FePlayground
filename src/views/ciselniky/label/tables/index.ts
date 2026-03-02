import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { Language } from '../type';

export const columns: Column[] = [
  { id: 'id', i18nKey: 'id', isVisible: false },
  { id: 'jazykId', i18nKey: 'jazykId', isVisible: false },
  { id: 'jazykPopis', i18nKey: 'jazykPopis', isVisible: true, width: 100, sortable: true },
  { id: 'text', i18nKey: 'text', isVisible: true, sortable: true },
];

export const table = new Table<Language>({
  columns,
  rows: [],
  name: 'jazyk',
  operations: OperationFlags.EDIT,
  rowKey: 'id',
  gridId: 1,
});
