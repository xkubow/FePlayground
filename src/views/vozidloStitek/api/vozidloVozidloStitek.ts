import { BaseApi } from '@/template/page/api';
import { VOZIDLO_VOZIDLO_STITEK } from '../constants';

class BarvaProvider extends BaseApi {
	postList(vozidloId: number, ids: number[]) {
		return this.post(`${this.apiPath}/List?id=${vozidloId}`, ids);
	}
	List<T = number[]>(vozidloId: number) {
		return this.fetch<T>(`${this.apiPath}/List`, { id: vozidloId });
	}
}

export const apiProvider = new BarvaProvider(VOZIDLO_VOZIDLO_STITEK);
