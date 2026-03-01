import type { DropdownItem } from '@/template/page/@types/mode';
import { BaseApi } from '@/template/page/api';
import { NAME as nameVyrobniLinka } from '../../constants';
import { NAME } from './constants';

class SegmentProvider extends BaseApi {
	getDropDownList<T = DropdownItem[]>(filter: { vyrobniLinkaId: number }) {
		return this.fetch<T>(`${this.apiPath}GetDropDownList`, filter);
	}
}

export const apiProvider = new SegmentProvider(nameVyrobniLinka, 'Ciselniky', NAME);
