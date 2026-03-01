import { BaseApi } from '@/template/page/api';
import { NAME as nameVyrobniLinka } from '../../constants';
import { NAME } from './constants';
import type { Response } from '@/template/api/api.d';

class PracovisteProvider extends BaseApi {
	updateArchEntity(id: number, data?: Record<string, unknown>): Response {
		const resp = this.update(`${this.apiPath}Archiv/`, id, data);
		return resp;
	}
}

export const apiProvider = new PracovisteProvider(nameVyrobniLinka, 'Ciselniky', NAME);
