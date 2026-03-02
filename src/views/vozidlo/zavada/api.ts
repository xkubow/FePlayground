import type { ApiResponse } from '@/template/api/api';
import { BaseApi } from '@/template/page/api';
import { STORE_TABLE } from '@/template/page/constants';
import { NAME_CAS_OPRAVY, NAME as NAME_VOZIDLO } from '../constants';
import { NAME_API } from './constants';

class ZavadaProvider extends BaseApi {
  tableUrl(tableName: string): string {
    const isMainTable = tableName === STORE_TABLE;
    switch (tableName) {
      case 'ridiciJednotkaInfo':
        return `${tableName}/`;
      case 'chyby':
        return `${NAME_VOZIDLO}/${tableName}/`;
      case NAME_CAS_OPRAVY:
        return `${NAME_VOZIDLO}/${tableName}/`;
      case 'navrhovane':
        return `${this.apiPath}/${tableName}/Archiv/`;
      default:
        return `${this.apiPath}${isMainTable ? '' : tableName}/`;
    }
  }
  pracovisteVznikuZavadyDropDownList(knr: number) {
    return this.fetch(`${this.apiPath}PracovisteVznikuZavadyDropDownList`, { knr });
  }
  pracovisteZadaniZavadyDropDownList(knr: number) {
    return this.fetch(`${this.apiPath}PracovisteZadaniZavadyDropDownList`, { knr });
  }
  odesliSqs(zavadaId: string) {
    return this.post<ApiResponse & { odeslanoDoSqsDatum: string }>(`${this.apiPath}odesliSqs`, zavadaId);
  }
}

export const apiProvider = new ZavadaProvider(NAME_API, NAME_VOZIDLO);
