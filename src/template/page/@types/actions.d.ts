import type { Response } from '@/template/api/api.d';

export type PageActions = {
  filter(filter: Record<string, unknown>): Response;
  default(filter: Record<string, unknown>): Response;
  loadEntity(params: { id: string | number }): Response;
  create(): Response<string>;
  update({ id }: { id: string | number }): Response;
  delete({ id }: { id: string | number }): Response;
  tableData({ filter, tableName }: { filter?: Record<string, unknown>; tableName: string }): Response;
  parseRow(tableName: string, rows: Row[]): Row[];
  exportTableData({ tableName }: { tableName: string }): void;
};
