import type { Column, Row } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { EnumVraceniBaterieStatus } from '../constants';

export type RowVraceniBaterie = {
  id: Number;
  vraceniBaterieStatusEnum: EnumVraceniBaterieStatus;
  vraceniBaterieStatusText: string;
  ndNr: string;
  bg?: string;
  fazitId?: string;
  swVersion: Number;
  hwVersion: string;
  text?: string;
};

export const columns: Column[] = [
  { id: 'id', i18nKey: 'id', isVisible: false },
  { id: 'vraceniBaterieStatusEnum', i18nKey: 'vraceniBaterieStatusEnum', isVisible: false },
  { id: 'vraceniBaterieStatusText', i18nKey: 'vraceniBaterieStatusText', isVisible: true, width: 100, sortable: true },
  { id: 'ndNr', i18nKey: 'ndNr', isVisible: true, width: 130, sortable: true },
  { id: 'bg', i18nKey: 'bG', isVisible: true, width: 130, sortable: true },
  { id: 'fazitId', i18nKey: 'fazitId', isVisible: true, sortable: true },
  { id: 'swVersion', i18nKey: 'swVersion', isVisible: true, width: 100, sortable: true },
  { id: 'hwVersion', i18nKey: 'hwVersion', isVisible: true, width: 100, sortable: true },
  { id: 'text', i18nKey: 'text', isVisible: true, sortable: true },
];

export const table = new Table<RowVraceniBaterie>({
  columns,
  rows: [],
  name: 'vraceniBaterie',
  operations: OperationFlags.DEFAULT,
  rowKey: 'id',
  gridId: 1,
});
