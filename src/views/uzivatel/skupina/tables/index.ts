import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { Skupina } from '../type';

export const columns: Column[] = [
  { id: 'id', i18nKey: 'id', isVisible: false, width: 100 },
  { id: 'text', i18nKey: 'text', isVisible: true, width: 100, sortable: true },
  { id: 'skupinaUzivateluTypEnum', i18nKey: 'skupinaUzivateluTypEnum', isVisible: false },
  { id: 'skupinaUzivateluTypText', i18nKey: 'skupinaUzivateluTypText', isVisible: true, sortable: true },
  { id: 'vyrobniLinkaId', i18nKey: 'vyrobniLinkaId', isVisible: false },
  { id: 'vyrobniLinkaText', i18nKey: 'vyrobniLinkaText', isVisible: true, sortable: true },
];

export const table = new Table<Skupina>({
  columns,
  rows: [],
  name: 'skupina',
  operations: OperationFlags.CREATE | OperationFlags.EDIT,
  rowKey: 'id',
  gridId: 1,
});
