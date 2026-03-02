import type { Column, Row } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { actualLocale } from '@/template/utils/date';
import { OperationFlags } from '@/template/utils/operationFlags';

export type RowVozidlo = {
  knr: number;
  vin: string;
  linka: string;
  modelovyKlicKod: string;
  modelText: string;
  vstupDatum: string;
  editDatum: string;
  vyrobaDatum: string;
  testIo: boolean;
};

export const columns: Column[] = [
  { id: 'knr', i18nKey: 'knr', isVisible: true },
  { id: 'vin', i18nKey: 'vin', isVisible: true },
  { id: 'linka', i18nKey: 'linka', isVisible: true },
  { id: 'modelovyKlicKod', i18nKey: 'modelovyKlicKod', isVisible: true },
  { id: 'modelText', i18nKey: 'modelText', isVisible: true },
  {
    id: 'vstupDatum',
    i18nKey: 'vstupDatum',
    isVisible: false,
    formatter: (row: Row, column: unknown, cellValue: unknown) => (cellValue ? new Date(cellValue as string).toLocaleDateString(actualLocale) : ''),
  },
  {
    id: 'editDatum',
    i18nKey: 'editDatum',
    isVisible: true,
    formatter: (row: Row, column: unknown, cellValue: unknown) => (cellValue ? new Date(cellValue as string).toLocaleDateString(actualLocale) : ''),
  },
  {
    id: 'vyrobaDatum',
    i18nKey: 'vyrobaDatum',
    isVisible: true,
    formatter: (row: Row, column: unknown, cellValue: unknown) => (cellValue ? new Date(cellValue as string).toLocaleDateString(actualLocale) : ''),
  },
  { id: 'testIo', i18nKey: 'testIo', isVisible: false },
];

export const table = new Table<RowVozidlo>({
  columns,
  rows: [],
  name: 'Zavady',
  operations: OperationFlags.EDIT,
  rowKey: 'i',
  gridId: 1,
  paging: {
    currentPage: 1,
    pageSize: 20,
    skip: 0,
    backCache: 20,
    count: 200,
  },
});
