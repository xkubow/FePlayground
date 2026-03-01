import type { Response } from '@/template/api/api.d';
import { BaseApi } from '@/template/page/api';
import { STORE_TABLE } from '@/template/page/constants';
import { NAME as NAME_VOZIDLO } from '../../constants';
import { NAME_API } from '../constants';
import { NAME } from './constants';

class ZavadaProvider extends BaseApi {
	filter(params?: Record<string, unknown>): Response {
		return {} as Response;
	}
	tableUrl(tableName: string): string {
		const isMainTable = tableName === STORE_TABLE;
		switch (tableName) {
			case STORE_TABLE:
				return `${this.apiPath}/Archiv/Prehled/`;
			default:
				return `${this.apiPath}${isMainTable ? '' : tableName}/`;
		}
	}
}

export const apiProvider = new ZavadaProvider(NAME, `${NAME_VOZIDLO}/${NAME_API}`);
