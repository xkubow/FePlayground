import type { Response } from '@/template/api/api.d';
import { BaseApi } from '@/template/page/api';
import { STORE_TABLE } from '@/template/page/constants';
import { apiProvider as prCisloApiProvider } from '@/views/ciselniky/prCislo/api';
import { CRUD_API, NAME } from '../constants';

class BarvaProvider extends BaseApi {
  default(params?: Record<string, unknown>): Response {
    return {} as Response;
  }
  filter(): Response {
    return {} as Response;
  }
  tableUrl(tableName: string): string {
    switch (tableName) {
      case 'prCislo':
        return `${prCisloApiProvider.apiPath}/`;
      case STORE_TABLE:
        return `${NAME}/`;
      default:
        return `${this.apiPath}${tableName}`;
    }
  }
}

export const apiProvider = new BarvaProvider(CRUD_API);
