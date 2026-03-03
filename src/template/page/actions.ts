import { useLogger } from '@/template/logger';
import { dataMapper } from '@/template/utils/dataMapper';
import _ from 'lodash';
import type { UnknownObject } from '../@types/kTemplate';
import type { Row } from '../components/table/@types/table';
import type { Table } from '../components/table';
import { errorNotImplemented } from '../logger/constants';
import type { TableOptions } from './@types/api';
import type { UnknownPageActions } from './@types/store';
import type { BaseApi } from './api';
import { STORE_TABLE } from './constants';
import hash from 'object-hash';

export function pageActions({ apiProvider }: { apiProvider?: BaseApi }): UnknownPageActions {
  const { log } = useLogger();
  return {
    async filter(filter: Record<string, unknown>) {
      try {
        this.startLoading();
        const entity = this.last;
        const response = await apiProvider?.filter(filter);
        if (response?.status === 200) {
          entity && _.set(entity, 'serverData', response?.data);
        }
        return response;
      } catch (error) {
        log('filter');
      } finally {
        this.endLoading();
      }
    },
    async default(filter: Record<string, unknown>) {
      const response = await apiProvider?.default(filter);
      const entity = _.last(this.entity);
      entity && _.merge(entity.serverData, response?.data);
      return response;
    },
    async loadEntity(params: { id: string | number }) {
      const response = await apiProvider?.loadEntity<UnknownObject>(params.id);
      const entity = _.last(this.entity);
      if (entity && response?.data) {
        entity.operations = (response?.data?.operations as number) ?? null;
        dataMapper(entity.serverData, response?.data);
        entity.hash = hash(entity.serverData);
      }
      return response;
    },
    async create() {
      const entity = _.last(this.entity);
      if (!entity) throw new Error('Entity doesnt exists');
      const response = await apiProvider?.createEntity<string>(entity.serverData);
      entity && _.merge(entity.serverData, response?.data);
      return response;
    },
    async update({ id }: { id: string | number }) {
      const entity = _.last(this.entity);
      if (!entity) throw new Error('Entity doesnt exists');
      const response = await apiProvider?.updateEntity(id, entity.serverData);
      entity && _.merge(entity.serverData, response?.data);
      return response;
    },
    async delete({ id }: { id: string | number }) {
      const entity = _.last(this.entity);
      if (!entity) throw new Error('Entity doesnt exists');
      const response = await apiProvider?.deleteEntity(id);
      entity && _.merge(entity.serverData, response?.data);
      return response;
    },
    async tableData(
      { filter, tableName }: { filter?: Record<string, unknown>; tableName: string } = {
        tableName: STORE_TABLE,
      },
    ) {
      const entity = _.last(this.entity);
      if (!entity) throw new Error('Entity doesnt exists');
      const table: Table = entity.tables[tableName];
      if (!table) throw new Error('Table doesnt exists');
      try {
        table.startLoading();

        let tableFilter: Record<string, unknown> | undefined = filter ?? table.filter ?? entity.serverData;
        if (table.filterMapper) {
          tableFilter = table.filterMapper({ ...entity });
        }

        const tableOptions: TableOptions = table.tableOptions();
        const response = await apiProvider?.tableData<{ rows: Record<string, unknown>[]; totalCount: number; operations?: number }>({
          tableName,
          filter: tableFilter,
          tableOptions,
        });
        if (response && response.data.rows) {
          table.rows = this.parseRow(tableName, response.data?.rows ?? response.data);
          'operations' in response.data && (table.operations = response.data.operations);
          table.totalCount = response.data.totalCount;
        }
        return response;
      } finally {
        table.endLoading();
      }
    },
    parseRow(tableName: string, rows: Row[]) {
      return rows;
    },
    exportTableData({ tableName = STORE_TABLE }): void {
      throw errorNotImplemented;
    },
  };
}
