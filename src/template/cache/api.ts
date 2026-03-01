import type { Response } from '@/template/api/api.d';
import { HttpRequest } from '@/template/api/httpRequest';
import type { AxiosResponse } from 'axios';
import type { DropdownList } from './../page/@types/mode.d';

export type LoadCache = { dropdownList: Record<string, DropdownList> };

export class Provider extends HttpRequest {
	constructor() {
		super();
	}

	loadCache(): Response<LoadCache> {
		return Promise.resolve({
			data: {
				dropDownList: {
					mistoTestu: [],
				},
			},
		} as AxiosResponse);
		// return this.fetch<LoadCache>(`${NAME}/loadCache`);
	}
}

export const apiProvider = new Provider();
