import type { Row } from '@/template/components/table/@types/table';
import type { Table } from '@/template/components/table';
import { useLogger } from '@/template/logger';
import type { TableOptions } from '@/template/page/@types/api';
import type { DropdownItem } from '@/template/page/@types/mode';
import { Page } from '@/template/page/@types/page';
import type { ActionOptions } from '@/template/page/@types/store';
import { listName, STORE_TABLE } from '@/template/page/constants';
import { pageStoreFactory } from '@/template/page/store';
import _ from 'lodash';
import { apiProvider } from '../api';
import { NAME } from '../constants';
import { apiProvider as apiProviderIbn } from '../ibn/api';
import { apiProvider as apiProviderSegment } from '../segment/api';
import { table, type RowKonfigurace } from '../tables/';
import type { VerzeDropDownItem, VyrobniLinkaDropDownItem, VyrobniZavodDropDownItem } from '../type';

export const server = {
  vyrobniZavod: null as number | null,
  vyrobniLinkaId: null as number | null,
  verze: null as number | null,
};

export const local = {
  vyrobniZavodList: [] as VyrobniZavodDropDownItem[],
  vyrobniLinkaList: [] as VyrobniLinkaDropDownItem[],
  verzeList: [] as VerzeDropDownItem[],
  kontrolniBodList: [] as DropdownItem[],
  segmentList: [] as DropdownItem[],
  editedRows: [] as Row<RowKonfigurace>[],
};

export const props = {};

export const tables = {
  table,
};

const { log } = useLogger();

const extraActions = {
  async filter(filter: Record<string, unknown>) {
    try {
      this.startLoading();
      const entity = this.last;
      const [vyrobniZavodResponse, vyrobniLinkaResponse, verzeResponse] = await Promise.allSettled([
        apiProvider?.vyrobniZavod(),
        apiProvider?.vyrobniLinka(),
        apiProvider?.verze(),
      ]);
      if (entity) {
        if (vyrobniZavodResponse.status === 'fulfilled' && vyrobniZavodResponse.value?.data)
          entity.localData.vyrobniZavodList = vyrobniZavodResponse.value?.data.rows.map((r) => ({ ...r, value: r.id })) ?? [];
        if (vyrobniLinkaResponse.status === 'fulfilled' && vyrobniLinkaResponse.value?.data)
          entity.localData.vyrobniLinkaList = vyrobniLinkaResponse.value?.data.rows.map((r) => ({ ...r, value: r.id })) ?? [];
        if (verzeResponse.status === 'fulfilled' && verzeResponse.value?.data)
          entity.localData.verzeList = verzeResponse.value?.data.rows.map((r) => ({ ...r, value: r.verze, text: r.verze.toString() })) ?? [];
      }
      return {};
    } catch (error) {
      log('filter action error');
    } finally {
      this.endLoading();
    }
  },
  async tableData(
    { filter, tableName }: { filter?: Record<string, unknown>; tableName: string } = {
      tableName: STORE_TABLE,
    },
  ) {
    const entity = _.last(this.entity);
    if (!entity) throw new Error('Entity doesnt exists');
    if (entity.serverData.vyrobniLinkaId == null || !entity.serverData.verze == null) return;
    const table: Table = entity.tables.table;
    try {
      if (!table) throw new Error('Table doesnt exists');
      table.startLoading();

      const tableOptions: TableOptions = table.tableOptions();
      const response = await apiProvider?.tableData<Table>({ tableName, filter, tableOptions });
      if (response && response.data.rows) {
        table.rows = response.data.rows;
        table.totalCount = response.data.totalCount;
        'operations' in response.data && (table.operations = response.data.operations);
      }
      const kontrolniBodResponse = await apiProviderIbn.getDropDownList(filter as { vyrobniLinkaId: number; verze: number });
      entity.localData.kontrolniBodList = kontrolniBodResponse?.data ?? [];
      const segmentList = await apiProviderSegment.getDropDownList(filter as { vyrobniLinkaId: number; verze: number });
      entity.localData.segmentList = segmentList?.data ?? [];
      return response;
    } finally {
      table.endLoading();
    }
  },
} as ActionOptions<typeof name, typeof server, typeof local, typeof props, typeof tables>;

const name = listName(NAME);

const page = new Page(name, server, local, props, tables);

export const useStore = pageStoreFactory({
  name,
  apiProvider,
  page,
  extraGetters: {},
  extraActions,
});
