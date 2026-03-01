import type { Response } from '@/template/api/api';
import { BaseApi } from '@/template/page/api';
import { NAME as NAME_ADMINISTRACE } from '../constants';
import { NAME } from './constants';
import type { Nastaveni } from './type';

class NastaveniProvider extends BaseApi {
	loadEntity<T = Nastaveni>(): Response<T> {
		return this.fetch<T>(this.apiPath);
	}
}

export const apiProvider = new NastaveniProvider(NAME, NAME_ADMINISTRACE);
