import type { Response } from '@/template/api/api.d';
import type { Options } from '@/template/page/@types/api';
import { BaseApi, removeLastSlash } from '@/template/page/api';
import { NAME } from './constants';

class UzivateProvider extends BaseApi {
  filter(): Response {
    return {} as Response;
  }
  default(params?: Record<string, unknown>): Response {
    return Promise.resolve({}) as Response;
  }
  loadEntity<T>(id: string | number, options: Options = { showError: true, cancelPrevious: true }): Response<T> {
    const resp = this.fetch<T>(`${this.apiPath}${id}`, {}, options);
    return resp;
  }
  addUizvatelToskupina(payload: { id2: string; id1: number }) {
    return this.post('SkupinaUzivatelu_Uzivatel', payload);
  }
  postVyrobniLinku(id: number) {
    return this.post(`${this.apiPath}VyrobniLinka`, id);
  }
}

export const apiProvider = new UzivateProvider(NAME);
