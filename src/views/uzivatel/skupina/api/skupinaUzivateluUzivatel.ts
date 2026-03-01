import { BaseApi } from '@/template/page/api';
import { NAME_SKUPINA_UZIVATEL } from '../../constants';

class SkupinaUzivatelu_UzivatelProvider extends BaseApi {
	/*postList(vozidloId: number, ids: number[]) {
		return this.post(`${this.apiPath}/List?id=${vozidloId}`, ids);
	}
	List<T = number[]>(vozidloId: number) {
		return this.fetch<T>(`${this.apiPath}/List`, { id: vozidloId });
	}*/
	deleteCrossEntity(id1: string, id2: string) {
		return this.delete(this.apiPath, { id1, id2 });
	}
}

export const apiProvider = new SkupinaUzivatelu_UzivatelProvider(NAME_SKUPINA_UZIVATEL);
