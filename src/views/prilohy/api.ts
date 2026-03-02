import { BaseApi } from '@/template/page/api';
import { NAME } from './constants';
import { NAME as NAME_VOZIDLO } from '@/views/vozidlo/constants';
import { NAME as NAME_ESKALACE } from '@/views/eskalace/constants';
import { NAME as NAME_VRACVENI_ND } from '@/views/vraceniBaterie/constants';
import type { Response } from '@/template/api/api';
import type { Table } from '@/template/components/table';
import type { Komentar } from '../komentar/type';
import type { Priloha } from './type';

class PrilohyProvider extends BaseApi {
  getByMasterId(id: number) {
    return this.fetch<Table<Priloha>>(`${this.apiPath}grid`, { [`${this.area}Id`]: id }, { showError: true, cancelPrevious: false });
  }
  create(id: number, data: FormData): Response {
    const resp = this.uploadMultipart(`${this.apiPath}?${this.area}Id=${id}`, data);
    return resp;
  }
  getFile(id: string | number | null | undefined, guid: string): Response {
    return this.fetchBlobs(`${this.apiPath}`, { [`${this.area}Id`]: id, guid });
  }
}

export const apiProviderVozidlo = new PrilohyProvider(NAME, NAME_VOZIDLO);
export const apiProviderEskalace = new PrilohyProvider(NAME, NAME_ESKALACE);
export const apiProviderNahradniNd = new PrilohyProvider(NAME, NAME_VRACVENI_ND);
