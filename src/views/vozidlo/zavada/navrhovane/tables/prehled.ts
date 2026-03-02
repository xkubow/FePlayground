import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { NavrhovaneZavady } from './table';

export const NAME = 'navrhovane';

export type NavrhovaneZavadyPrehledDetail = {
  vozidloZavadaId: number;
  sqsZavadaVinikId: number;
  sqsZavadaVinikText: string;
  sqsZavadaTypId: number;
  sqsZavadaTypText: string;
  sqsZavadaSkupinaId: number;
  sqsZavadaSkupinaText: string;
  sqsZavadaMistoId: number;
  sqsZavadaMistoText: string;
  detail: NavrhovaneZavady[];
};

export const columnsDetail: Column[] = [
  { id: 'vozidloZavadaId', i18nKey: 'vozidloZavadaId', isVisible: false },
  { id: 'sqsZavadaVinikId', i18nKey: 'sqsZavadaVinikId', isVisible: false },
  { id: 'sqsZavadaVinikText', i18nKey: 'sqsZavadaVinikText', isVisible: true },
  { id: 'sqsZavadaTypId', i18nKey: 'sqsZavadaTypId', isVisible: false },
  { id: 'sqsZavadaTypText', i18nKey: 'sqsZavadaTypText', isVisible: true },
  { id: 'sqsZavadaSkupinaId', i18nKey: 'sqsZavadaSkupinaId', isVisible: false },
  { id: 'sqsZavadaSkupinaText', i18nKey: 'sqsZavadaSkupinaText', isVisible: true },
  { id: 'sqsZavadaMistoId', i18nKey: 'sqsZavadaMistoId', isVisible: false },
  { id: 'sqsZavadaMistoText', i18nKey: 'sqsZavadaMistoText', isVisible: true },
  { id: 'detail', i18nKey: 'detail', isVisible: true, width: 70 },
];

export type NavrhovaneZavadyPrehled = {
  knr: string;
  detail: NavrhovaneZavadyPrehledDetail[];
};

export const columns: Column[] = [
  { id: 'knr', i18nKey: 'knr', isVisible: true },
  { id: 'detail', i18nKey: 'detail', isVisible: true, width: 70 },
];

export const table = new Table<NavrhovaneZavadyPrehled>({
  columns,
  rows: [],
  name: 'NavrhovaneZavadyPrehled',
  operations: OperationFlags.DEFAULT,
  rowKey: 'knr',
  gridId: 1,
});
