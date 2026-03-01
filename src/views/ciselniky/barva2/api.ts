import type { Response } from '@/template/api/api.d';
import { BaseApi } from '@/template/page/api';
import { STORE_TABLE } from '@/template/page/constants';
import { NAME as NAME_CISELNIKY } from '../constants';
import { NAME } from './constants';

class BarvaProvider extends BaseApi {
	filter(): Response {
		return {} as Response;
	}
	tableUrl(tableName: string): string {
		const isMainTable = tableName === STORE_TABLE;
		const table = isMainTable ? '' : `${tableName}/`;
		return `${this.apiPath}${table}`;
	}
}

export const apiProvider = new BarvaProvider(NAME, NAME_CISELNIKY);
