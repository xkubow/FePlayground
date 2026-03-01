import type { Response } from '@/template/api/api.d';
import type { TableApi } from '@/template/components/table/@types/table';
import type { DropdownItem } from '@/template/page/@types/mode';
import { BaseApi } from '@/template/page/api';
import { NAME } from './constants';
import type { VerzeDropDownItem, VyrobniZavodDropDownItem } from './type';

class VozidloProvider extends BaseApi {
	filter(): Response {
		return {} as Response;
	}
	vyrobniZavod(): Response<TableApi<VyrobniZavodDropDownItem>> {
		return this.fetch<TableApi<VyrobniZavodDropDownItem>>(`${this.area}/VyrobniZavod/Grid`);
	}
	verze(): Response<TableApi<VerzeDropDownItem>> {
		return this.fetch<TableApi<VerzeDropDownItem>>(`${this.apiPath}Verze/Grid`);
	}
	addVerze(vyrobniLinkaId: number): Response<number> {
		return this.fetch<number>(`${this.apiPath}Verze/PridejVerzi`, { vyrobniLinkaId });
	}
	aktivujPosledniVerzi(vyrobniLinkaId: number): Response<number> {
		return this.fetch<number>(`${this.apiPath}Verze/AktivujPosledniVerzi`, { vyrobniLinkaId });
	}
	deleteVerze(vyrobniLinkaId: number): Response {
		return this.fetch(`${this.apiPath}Verze/SmazVerzi`, { vyrobniLinkaId });
	}
	getDropDownList<T = DropdownItem[]>() {
		return this.fetch<T>(`${this.apiPath}GetDropDownList`);
	}
}

export const apiProvider = new VozidloProvider(NAME, 'Ciselniky');
