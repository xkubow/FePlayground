import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';

export type RowLinka = {
  id: number;
  vyrobniZavodId: number;
  aktivniVerze: number;
  pripravovanaVerze: number | null;
  aktivni: boolean;
  name: string;
  text: string;
  edit?: boolean;
};

export const columns: Column[] = [
  { id: 'vyrobniZavodId', i18nKey: 'vyrobniZavod', isVisible: true, width: 150 },
  { id: 'name', i18nKey: 'name', isVisible: true, width: 150 },
  { id: 'text', i18nKey: 'text', isVisible: true },
  { id: 'aktivni', i18nKey: 'aktivni', isVisible: true, width: 100, align: 'center' },
  { id: 'aktivniVerze', i18nKey: 'aktivniVerze', isVisible: true, width: 110, align: 'center' },
  { id: 'pripravovanaVerze', i18nKey: 'pripravovanaVerze', isVisible: true, width: 130, align: 'center' },
];

export const table = new Table<RowLinka>({
  columns,
  rows: [],
  name: 'vyrobniLinka',
  operations: OperationFlags.DEFAULT,
  rowKey: 'id',
  gridId: 1,
  paging: {
    currentPage: 1,
    pageSize: 20,
    skip: 0,
    backCache: 20,
    count: 200,
  },
});
