import type { EmptyObject, UnknownObject } from '@/template/@types/kTemplate.d';
import type { Response } from '@/template/api/api.d';
import type { Table } from '@/template/components/table';
import type { StateTree } from 'pinia';
import type { ComputedRef } from 'vue';

export class Page<TServerData, TLocalData, TProps, TTable extends Record<string, Table>> implements StateTree {
  entity: Entity<TServerData, TLocalData, TProps, TTable>[] = [];
  entityDefault: Entity<TServerData, TLocalData, TProps, TTable>;
  constructor(
    public name: string,
    serverData: TServerData,
    localData: TLocalData,
    props: TProps,
    tables: TTable,
  ) {
    this.entityDefault = new Entity(serverData, localData, tables, props);
    // this.entity.push(new Entity(serverData, localData, tables, props));
  }
}

export class Entity<TServerData, TLocalData, TProps, TTable extends Record<string, Table>> {
  id: string | number | null = null;
  loadingCount = 0;
  mainCollapse: string[] = [];
  activeTabName: string | null = null;
  hash: string | null = null;
  operations: number | null = null;
  constructor(
    public serverData: TServerData,
    public localData: TLocalData,
    public tables: TTable,
    public props: TProps,
  ) {}
}

export type InitPageManager = { leaving: ComputedRef<boolean> };

export type TableFetchIntakes = {
  tablesToFetch?: string[];
  filter?: Record<string, unknown>;
};

export type InitTables = {
  tableNames: ComputedRef<string[]>;
  fetchTableData: ({ tablesToFetch, filter }: TableFetchIntakes) => void;
  loadTables: (filter?: Record<string, unknown>, tablesToFetch?: string[]) => void;
  filterClick: ({ tableName, filter }: { tableName: string; filter?: UnknownObject }) => Response;
  loadRows: ({ tableName, filter }: { tableName: string; filter?: UnknownObject }) => Response;
};

export type EmptyPage = Page<EmptyObject, EmptyObject, EmptyObject, EmptyObject>;
export type UnknownPage = Page<UnknownObject, UnknownObject, UnknownObject, EmptyObject>;
