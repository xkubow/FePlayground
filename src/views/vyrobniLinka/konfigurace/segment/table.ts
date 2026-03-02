import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';

export type RowSegmenty = {
  vyrobniLinkaSegmentId: number;
  vyrobniLinkaSegmentText: string;
  editSegment?: boolean;
};

export const columns: Column[] = [{ id: 'vyrobniLinkaSegmentText', i18nKey: 'vyrobniLinkaSegmentText', isVisible: true, align: 'center' }];

export const table = new Table<RowSegmenty>({
  columns,
  rows: [],
  name: 'segmety',
  operations: OperationFlags.DEFAULT,
  rowKey: 'vyrobniLinkaSegmentId',
  gridId: 1,
});
