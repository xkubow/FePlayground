import type { Response } from '@/template/api/api.d';
import { BaseApi } from '@/template/page/api';
import { NAME } from './constants';
import type { Eskalace } from './type';
import type { ChangeLogRow } from './tables/changeLogTable';
import type { Table } from '@/template/components/table';

class EskalaceProvider extends BaseApi {
	vraceniKAnalyze(entity: Eskalace) {
		return this.post(`${this.apiPath}VraceniKAnalyze`, entity);
	}
	predaniKReseni(entity: Eskalace) {
		return this.post(`${this.apiPath}PredaniKReseni`, entity);
	}
	filter(params?: Record<string, unknown>): Response {
		return this.fetch(`${this.apiPath}filter`);
	}
	schvaleni(params: Partial<Eskalace>) {
		return this.post(`${this.apiPath}Schvaleni`, params);
	}
	zamitnuti(params: Partial<Eskalace>) {
		return this.post(`${this.apiPath}Zamitnuti`, params);
	}
	uzavreni(params: Partial<Eskalace>) {
		return this.post(`${this.apiPath}Uzavreni`, { ...params, prirazenaSkupinaUzivateluId: null, uzivatelPrirazeno: [] });
	}
	UzavrenaKOtevreni(params: Partial<Eskalace>) {
		return this.post(`${this.apiPath}Znovuotevreni`, params);
	}
	predaniDoVyroby(params: Partial<Eskalace>) {
		return this.post(`${this.apiPath}PredaniDoVyroby`, params);
	}
	predaniKeSchvaleni(params: Partial<Eskalace>) {
		return this.post(`${this.apiPath}predaniKeSchvaleni`, params);
	}
	predaniKeAnalyze(params: Partial<Eskalace>) {
		return this.post(`${this.apiPath}predaniKAnalyze`, params);
	}
	pocetNezpracovanych() {
		return this.fetch<number>(`${this.apiPath}PocetNezpracovanych`);
	}
	getByMasterId<T>(knr: number, edit = true) {
		return this.fetch<T>(`${this.apiPath}getByMasterId?knr=${knr}&edit=${edit}`);
	}
	getChangeLog(eskalaceId: number) {
		return this.fetch<Table<ChangeLogRow>>(`${this.apiPath}ChangeLog/Grid`, { eskalaceId });
	}
}

export const apiProvider = new EskalaceProvider(NAME);
