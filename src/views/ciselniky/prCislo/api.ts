import type { Response } from '@/template/api/api.d';
import type { DropdownItem } from '@/template/page/@types/mode';
import { BaseApi } from '@/template/page/api';
import { NAME as NAME_CISELNIKY } from '../constants';
import { NAME } from './constants';

export class Provider extends BaseApi {
	filter(): Response {
		return {} as Response;
	}
	getDropDownList(): Response<DropdownItem[]> {
		return this.fetch<DropdownItem[]>(`${this.apiPath}/GetDropDownList`);
	}
}

export const apiProvider = new Provider(NAME, NAME_CISELNIKY);
