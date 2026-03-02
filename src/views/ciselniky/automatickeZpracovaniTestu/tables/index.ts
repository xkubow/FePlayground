import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { AutomatickeZpracovaniTestu } from '../type';

export const columns: Column[] = [
  { id: 'automatickeZpracovaniTestuEnum', i18nKey: 'automatickeZpracovaniTestuEnum', isVisible: true, sortable: true },
  { id: 'definiceZavadyId', i18nKey: 'definiceZavadyId', isVisible: false, sortable: false },
  { id: 'text', i18nKey: 'text', isVisible: true, width: 400, sortable: true },
  { id: 'sqsZavadaRadekId', i18nKey: 'sqsZavadaRadekId', isVisible: false, sortable: false },
  { id: 'sqsZavadaMistoText', i18nKey: 'sqsZavadaMistoText', isVisible: true, sortable: true },
  { id: 'sqsZavadaTypId', i18nKey: 'sqsZavadaTypId', isVisible: false, sortable: false },
  { id: 'sqsZavadaTypText', i18nKey: 'sqsZavadaTypText', isVisible: true, sortable: true },
  { id: 'sqsZavadaVinikId', i18nKey: 'sqsZavadaVinikId', isVisible: false, sortable: false },
  { id: 'sqsZavadaVinikText', i18nKey: 'sqsZavadaVinikText', isVisible: true, sortable: true },
];

export const table = new Table<AutomatickeZpracovaniTestu>({
  columns,
  rows: [],
  name: 'automatickeZpracovaniTestu',
  operations: OperationFlags.EDIT,
  rowKey: 'automatickeZpracovaniTestuEnum',
  gridId: 1,
});
