import type { Column, Row } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { actualDateFormat, actualLocale } from '@/template/utils/date';
import { OperationFlags } from '@/template/utils/operationFlags';
import dayjs from 'dayjs';

export type CasOpravyZavada = {
  id: number;
  casZacatek: Date;
  dobaOpravyMinuty: number;
  text: string | null;
  opravilZobrazeneJmeno: string | null;
};

export const columns: Column[] = [
  { id: 'id', i18nKey: 'id', isVisible: false, sortable: false },
  {
    id: 'casZacatek',
    i18nKey: 'casZacatek',
    isVisible: true,
    formatter: (row: Row, column: unknown, cellValue: unknown) => {
      const fromDate = dayjs(new Date(cellValue as string));
      const to = fromDate.add((row as CasOpravyZavada).dobaOpravyMinuty ?? 0, 'minute');
      return `${fromDate.format(actualDateFormat)} - ${to.format(actualDateFormat)}`;
    },
  },
  { id: 'dobaOpravyMinuty', i18nKey: 'dobaOpravyMinuty', isVisible: true, sortable: true },
  { id: 'text', i18nKey: 'text', isVisible: true, sortable: true },
  { id: 'opravilZobrazeneJmeno', i18nKey: 'opravilZobrazeneJmeno', isVisible: true, sortable: true },
];

export const table = new Table<CasOpravyZavada>({
  columns,
  rows: [],
  name: 'casOpravy',
  operations: OperationFlags.EDIT,
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
