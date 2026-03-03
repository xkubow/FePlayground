import type { Response } from '@/template/api/api.d';
import { HttpRequest } from '@/template/api/httpRequest';
import type { Options, TableOptions } from './@types/api';
import { STORE_TABLE } from './constants';

export function reportUrl(reportName: string): string {
  return `/Reports/Reports/${reportName}`;
}

export function removeLastSlash(str: string) {
  if (!str || str.length === 0 || str[str.length - 1] !== '/') return str;
  return str.substring(0, str.length - 1);
}

export class BaseApi extends HttpRequest {
  public apiPath: string;

  private urlFragments: string[];

  constructor(
    public controller: string,
    public area?: string,
    ...urlFragments: string[]
  ) {
    super();

    this.urlFragments = urlFragments;
    const urlFragmentsStr = this.urlFragments.length > 0 ? `${this.urlFragments.join('/')}/` : '';
    this.apiPath = `${area ? `/${this.area}` : ''}/${this.controller}/${urlFragmentsStr}`;
  }

  tableUrl(tableName: string): string {
    const isMainTable = tableName === STORE_TABLE;
    return `${this.apiPath}${isMainTable ? '' : tableName}`;
  }

  tableSchemaUrl(tableName: string): string {
    return `${this.tableUrl(tableName)}Grid`;
  }

  tableDataUrl(tableName: string): string {
    return `${this.tableUrl(tableName)}Grid`;
  }

  tableRowDetailUrl(tableName: string): string {
    return `${this.tableUrl(tableName)}RowDetail`;
  }

  tableSchemaDataUrl(tableName: string): string {
    return `${this.apiPath}${tableName}SchemaAndRows`;
  }

  tableDeleteEntityUrl(tableName: string): string {
    return `${this.apiPath}${tableName}DeleteEntity`;
  }

  filter(params?: Record<string, unknown>): Response {
    const resp = this.fetch(`${this.apiPath}filter`, params);
    return resp;
  }

  default(params?: Record<string, unknown>): Response {
    const resp = this.fetch(`${this.apiPath}default`, params);
    return resp;
  }

  loadEntity<T>(id: string | number, options: Options = { showError: true, cancelPrevious: true }): Response<T> {
    const resp = this.fetch<T>(`${this.apiPath}${id}`, undefined, options);
    return resp;
  }

  createEntity<T = string>(data?: Record<string, unknown>): Response<T> {
    const resp = this.post<T>(this.apiPath, data);
    return resp;
  }

  updateEntity(id: string | number, data?: Record<string, unknown>): Response {
    const resp = this.update(this.apiPath, id, data);
    return resp;
  }

  deleteEntity(id: string | number): Response {
    const resp = this.delete(this.apiPath, { id });
    return resp;
  }

  //#region table

  tableSchema({ tableName = STORE_TABLE }: { tableName: string }): Response {
    const resp = this.fetch(`${this.tableSchemaUrl(tableName)}`, { wantSchema: true });

    return resp;
  }

  tableData<T = unknown>({
    filter,
    tableName = STORE_TABLE,
    tableOptions,
    options,
  }: {
    filter?: Record<string, unknown>;
    tableName: string;
    tableOptions?: TableOptions;
    options?: Options;
  }): Response<T> {
    const resp = this.fetch<T>(`${this.tableDataUrl(tableName)}`, { ...filter, tableOptions }, options ?? { showError: true, cancelPrevious: true });
    return resp;
  }

  rowDetail({ id, tableName = STORE_TABLE }: { id: string | number; tableName: string }): Promise<unknown> {
    const resp = this.fetch(`${this.tableRowDetailUrl(tableName)}${id}`, undefined);
    return resp;
  }

  //#endregion
}
