import type { Response } from '@/template/api/api';
import { BaseApi } from '@/template/page/api';
import { NAME as VOZIDLO_NAME } from '@/views/vozidlo/constants';
import { NAME as ESKALACE_NAME } from '@/views/eskalace/constants';
import { NAME as VRACENI_ND_NAME } from '@/views/vraceniBaterie/constants';
import { NAME } from './constants';
import type { Table } from '@/template/components/table';
import type { Komentar } from './type';
//[`${this.area}Id`]
class KomentarProvider extends BaseApi {
	getByMasterId(id: number) {
		return this.fetch<Table<Komentar>>(`${this.apiPath}grid`, { [`${this.area}Id`]: id }, { showError: true, cancelPrevious: false });
	}
	updateKomentarEntity(data?: Record<string, unknown>): Response {
		return this.update(this.apiPath, undefined, data);
	}
}

export const apiProvider = new KomentarProvider(NAME, VOZIDLO_NAME);

export const apiProviderEskalaceKomentar = new KomentarProvider(NAME, ESKALACE_NAME);

export const apiProviderVraceniBaterieKomentar = new KomentarProvider(NAME, VRACENI_ND_NAME);
