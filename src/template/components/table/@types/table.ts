import type { UnknownObject } from '@/template/@types/kTemplate';
import type { Component } from 'vue';

export type RowButtons = 'edit' | 'view' | 'select' | 'process' | 'delete';

export type Paging = {
  currentPage: number;
  pageSize: number;
  skip: number;
  backCache: number; // nasobky pageSize
  count: number; // nasobky pageSize
};

export type Column = {
  id: string;
  i18nKey: string;
  width?: number;
  columns?: Column[];
  isVisible: boolean;
  formatter?: <T extends UnknownObject = UnknownObject>(row: Row<T>, column: unknown, cellValue: unknown, index: number) => string;
  isEditable?: boolean;
  required?: boolean;
  sortingIndex?: number;
  sortingAscending?: boolean;
  align?: string;
  filterable?: boolean;
  filter?: string;
  sortable?: boolean;
};

export type Row<T extends UnknownObject = UnknownObject> = T;
// {
// 	cells: T;
// 	operations: number;
// };

export type CellNamesObject = Record<string, number> & { idColumn: number };

export type OnClick<T extends UnknownObject = UnknownObject> = (e: Event, cells: Row<T>, rowKey?: string) => void;

export type OperationFunction<T extends UnknownObject = UnknownObject> = (f: OnClick<T>) => ExtraButton;

export type ClickActionFunctions = 'editClickAction' | 'viewClickAction' | 'selectClickAction' | 'processClickAction' | 'deleteClickAction';

export type ExtraButton<T extends UnknownObject = UnknownObject> = {
  icon: Component;
  onClickAction: OnClick<T>;
  value: string;
  isVisible: (row: Row<T>) => boolean;
};

export type RowKey = string | ((val: unknown) => string);

export type TableApi<T = UnknownObject> = { totalCount: number; rows: T[] };
