import type { Response } from '@/template/api/api.d';
import { BaseApi } from '@/template/page/api';
import { STORE_TABLE } from '@/template/page/constants';
import { NAME, NAME_CAS_OPRAVY } from './constants';
import { NAME as ZAVADA_NAME } from '../zavada/constants';

class VozidloProvider extends BaseApi {
  filter(params?: Record<string, unknown>): Response {
    return {} as Response;
  }
  tableUrl(tableName: string): string {
    // const isMainTable = tableName === STORE_TABLE;
    switch (tableName) {
      case 'sqsZavady':
        return '/sqs/vozidloZavada/';
      case 'ridiciJednotkaInfo':
      case 'vozidloStitek':
        return `${tableName}/`;
      case 'navrhovane':
        return `${NAME}/${ZAVADA_NAME}/${tableName}/`;
      case STORE_TABLE:
        return `${this.apiPath}`;
      default:
        return `${this.apiPath}${tableName}/`;
    }
  }
  tableDataUrl(tableName: string): string {
    switch (tableName) {
      case 'semafor':
        return `${this.apiPath}${tableName}`;
      default:
        return `${this.tableUrl(tableName)}Grid`;
    }
  }
}

export const apiProvider = new VozidloProvider(NAME);
export const apiProviderCasOpravy = new BaseApi(NAME_CAS_OPRAVY, NAME);
