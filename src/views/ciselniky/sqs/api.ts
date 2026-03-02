import type { Response } from '@/template/api/api.d';
import { HttpRequest } from '@/template/api/httpRequest';
import type { DropdownItem } from '@/template/page/@types/mode';
import { NAME as NAME_CISELNIKY } from '../constants';
import type { SqsZavadaRadek } from '../types';
import { NAME } from './constants';

export class Provider extends HttpRequest {
  constructor() {
    super();
  }

  getSqsZavadaVinikDropDownList(): Response<DropdownItem[]> {
    return this.fetch<DropdownItem[]>(`${NAME_CISELNIKY}/${NAME}/GetSqsZavadaVinikDropDownList`);
  }
  getSqsZavadaTypDropDownList(): Response<DropdownItem[]> {
    return this.fetch<DropdownItem[]>(`${NAME_CISELNIKY}/${NAME}/GetSqsZavadaTypDropDownList`);
  }
  getSqsZavadaKategorieDropDownList(): Response<DropdownItem[]> {
    return this.fetch<DropdownItem[]>(`${NAME_CISELNIKY}/${NAME}/GetSqsZavadaKategorieDropDownList`);
  }
  getSqsZavadaSkupinaDropDownList(): Response<DropdownItem[]> {
    return this.fetch<DropdownItem[]>(`${NAME_CISELNIKY}/${NAME}/GetSqsZavadaSkupinaDropDownList`);
  }
  getSqsZavadaRadekDropDownList<T = SqsZavadaRadek[]>(): Response<T> {
    return this.fetch<T>(`${NAME_CISELNIKY}/${NAME}/GetSqsZavadaRadekDropDownList`);
  }
}

export const apiProvider = new Provider();
