import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { Uzivatel } from '../type';

export const columns: Column[] = [
  { id: 'id', i18nKey: 'id', isVisible: false },
  { id: 'dzc', i18nKey: 'dzc', isVisible: true, width: 100, filterable: true, sortable: true },
  { id: 'mfaPerNr', i18nKey: 'MfaPerNr', isVisible: true, width: 100, filterable: true, sortable: true },
  { id: 'zobrazeneJmeno', i18nKey: 'zobrazeneJmeno', isVisible: true, filterable: true, sortable: true },
  { id: 'oddeleni', i18nKey: 'oddeleni', isVisible: true, filterable: true, sortable: true },
  { id: 'zkusenost', i18nKey: 'Zkusenost', isVisible: true, filterable: true, sortable: true },
  { id: 'email', i18nKey: 'email', isVisible: true, filterable: true },
  { id: 'vyrobniLinkaId', i18nKey: 'vyrobniLinkaId', isVisible: true, filterable: true, sortable: true },
];

export const table = new Table<Uzivatel>({
  columns,
  rows: [],
  name: 'uzivatel',
  operations: OperationFlags.DEFAULT,
  rowKey: 'id',
  gridId: 1,
});
