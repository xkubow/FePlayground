import type { DropdownItem } from '@/template/page/@types/mode';
import { BaseApi } from '@/template/page/api';
import { NAME as nameVyrobniLinka } from '../../constants';
import { NAME } from './constants';

class KontrolniBodProvider extends BaseApi {
  getDropDownList<T = DropdownItem[]>(filter: { vyrobniLinkaId: number; aktivniVerze?: boolean }) {
    return this.fetch<T>(`${this.apiPath}GetDropDownList`, filter);
  }
}

export const apiProvider = new KontrolniBodProvider(nameVyrobniLinka, 'Ciselniky', NAME);
