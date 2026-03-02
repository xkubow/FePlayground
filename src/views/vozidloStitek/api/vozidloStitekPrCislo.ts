import { BaseApi } from '@/template/page/api';
import { VOZIDLO_STITOK_PR_CISLO } from '../constants';

class BarvaProvider extends BaseApi {
  postList(vozidloId: number, ids: number[]) {
    return this.post(`${this.apiPath}/List?id=${vozidloId}`, ids);
  }
  list<T = number[]>(vozidloId: number) {
    return this.fetch<T>(`${this.apiPath}/List`, { id: vozidloId });
  }
  deleteCrossEntity(id1: string, id2: string) {
    return this.delete(this.apiPath, { id1, id2 });
  }
}

export const apiProvider = new BarvaProvider(VOZIDLO_STITOK_PR_CISLO);
