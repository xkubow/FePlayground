import type { UnknownObject } from '@/template/@types/kTemplate';
import { computed } from 'vue';
import type { InitTables, TableFetchIntakes } from '../@types/page';
import type { PageStore } from '../@types/store';

export function useTables<S extends PageStore>(pageStore: S): InitTables {
  const tableNames = computed(() => Object.keys(pageStore.last?.tables ?? {}));

  const fetchTableData = ({ tablesToFetch = tableNames.value, filter }: TableFetchIntakes) => {
    const tables: string[] = tablesToFetch;
    tables.forEach((tableName) => {
      if (pageStore.last?.tables[tableName].loadByEntityId) {
        pageStore.last.id && pageStore.tableData({ tableName, filter: filter ?? pageStore.last?.tables[tableName].filter ?? {} });
      } else {
        pageStore.tableData({ tableName, filter: filter ?? pageStore.last?.tables[tableName].filter ?? {} });
      }
    });
  };
  const loadTables = async (filter?: Record<string, unknown>, tablesToFetch = tableNames.value) => {
    fetchTableData({ filter, tablesToFetch });
  };

  function loadRows({ tableName, filter }: { tableName: string; filter?: UnknownObject }) {
    return filterClick({ tableName, filter });
  }

  function filterClick({ tableName, filter }: { tableName: string; filter?: UnknownObject }) {
    debugger;
    return pageStore.tableData({
      filter: filter ?? pageStore.last?.tables[tableName].filter ?? {},
      tableName,
    });
  }

  return { tableNames, loadTables, fetchTableData, filterClick, loadRows };
}
