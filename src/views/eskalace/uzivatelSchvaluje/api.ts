import { BaseApi } from '@/template/page/api';
import { NAME as ESKALACE_NAME } from '../constants';
import { NAME } from './constants';
class UzivatelPrirazenoProvider extends BaseApi {
	postList(id: number, data: string[]) {
		return this.post(`${this.apiPath}List?id=${id}`, data);
	}
	list(id: number) {
		return this.fetch(`${this.apiPath}List`, { id });
	}
}

export const apiProvider = new UzivatelPrirazenoProvider(NAME, ESKALACE_NAME);
