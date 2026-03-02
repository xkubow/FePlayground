import type { Column } from '@/template/components/table/@types/table';
import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';

export type RowKonfigurace = {
  rowNumber: number;
  vyrobniLinkaKontrolniBodId: number;
  vyrobniLinkaSegmentId: number;
  poradi: number;
  ibnNazev: string;
  zobrazitNaSemaforu: boolean;
  repaseKontrolniBodId: number;
  repaseKontrolniBodIbnNazev: string;
  vyrobniLinkaSegmentText: string;
  vyrobniLinkaPracovisteId: number;
  vyrobniLinkaPracovisteArcId: number;
  vyrobniLinkaPracovisteUpsNazev: string;
  vyrobniLinkaPracovisteSqsId: number;
  vyrobniLinkaSegmentUpsNazev: string;
  cislo: number;
  editIbn?: boolean;
  editSegment?: boolean;
  editPracoviste?: boolean;
};

export const columns: Column[] = [
  {
    id: 'ibn',
    i18nKey: 'ibn',
    isVisible: true,
    align: 'center',
    columns: [
      { id: 'poradi', i18nKey: 'poradi', isVisible: true, width: 70, align: 'center' },
      { id: 'ibnNazev', i18nKey: 'ibnNazev', isVisible: true, align: 'center' },
      { id: 'repaseKontrolniBodIbnNazev', i18nKey: 'repaseKontrolniBodIbnNazev', isVisible: true, width: 120, align: 'center' },
      { id: 'zobrazitNaSemaforu', i18nKey: 'zobrazitNaSemaforu', isVisible: true, width: 160, align: 'center' },
    ],
  },
  {
    id: 'segment',
    i18nKey: 'segment',
    isVisible: true,
    align: 'center',
    columns: [
      { id: 'vyrobniLinkaSegmentText', i18nKey: 'vyrobniLinkaSegmentText', isVisible: true, width: 200, align: 'center' },
      { id: 'vyrobniLinkaSegmentUpsNazev', i18nKey: 'vyrobniLinkaSegmentUpsNazev', isVisible: true, width: 100, align: 'center' },
    ],
  },
  {
    id: 'pracoviste',
    i18nKey: 'pracoviste',
    isVisible: true,
    align: 'center',
    columns: [
      { id: 'vyrobniLinkaPracovisteUpsNazev', i18nKey: 'vyrobniLinkaPracovisteUpsNazev', isVisible: true, width: 130 },
      { id: 'vyrobniLinkaPracovisteSqsId', i18nKey: 'vyrobniLinkaPracovisteSqsId', isVisible: true, width: 70 },
      { id: 'cislo', i18nKey: 'cislo', isVisible: true, width: 70, align: 'center' },
    ],
  },
];

export const table = new Table<RowKonfigurace>({
  columns,
  rows: [],
  name: 'konfiguraceLinky',
  operations: OperationFlags.DEFAULT,
  rowKey: 'vyrobniLinkaPracovisteId',
  gridId: 1,
});
