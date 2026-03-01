import type { Response } from '@/template/api/api.d';
import type { DropdownItem } from '@/template/page/@types/mode';
import { BaseApi } from '@/template/page/api';
import { STORE_TABLE } from '@/template/page/constants';
import { NAME as NAME_UZIVATEL } from '../../constants';
import { NAME } from '../constants';

class SkupinaProvider extends BaseApi {
	filter(): Response {
		return {} as Response;
	}
	tableUrl(tableName: string): string {
		const isMainTable = tableName === STORE_TABLE;
		const table = isMainTable ? '' : `${tableName}/`;
		switch (tableName) {
			case NAME_UZIVATEL:
				return `${table}`;
			default:
				return `${this.apiPath}${table}`;
		}
	}
	dropDownList<T = DropdownItem[]>(payload: { enumSkupinaUzivateluTyp: number }) {
		return this.fetch<T>(`${this.apiPath}DropDownList`, payload);
	}
	typDropDownList(): Response<DropdownItem[]> {
		return this.fetch<DropdownItem[]>(`${this.apiPath}TypDropDownList`);
	}
	default(params?: Record<string, unknown>): Response {
		return Promise.resolve({}) as Response;
	}
}

export const apiProvider = new SkupinaProvider(NAME, NAME_UZIVATEL);
