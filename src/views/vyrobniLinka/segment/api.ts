import type { DropdownItem } from '@/template/page/@types/mode';
import { BaseApi } from '@/template/page/api';
import { AKTIVNI, NAME as NAME_VYROBNI_LINKA } from '../constants';
import { NAME } from './constants';

class SegmentProvider extends BaseApi {
	getDropDownList<T = DropdownItem[]>(filter: { vyrobniLinkaId: number }) {
		return this.fetch<T>(`${this.apiPath}GetDropDownList`, filter);
	}
}

export const apiProvider = new SegmentProvider(NAME_VYROBNI_LINKA, 'Ciselniky', NAME, AKTIVNI);
