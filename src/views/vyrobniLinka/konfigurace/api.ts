import type { Response } from '@/template/api/api.d';
import type { TableApi } from '@/template/components/table/@types/table';
import { BaseApi } from '@/template/page/api';
import { NAME } from '../constants';
import type { VerzeDropDownItem, VyrobniLinkaDropDownItem, VyrobniZavodDropDownItem } from './type';

class KonfiguraceProvider extends BaseApi {
  filter(): Response {
    return {} as Response;
  }
  vyrobniZavod(): Response<TableApi<VyrobniZavodDropDownItem>> {
    return this.fetch<TableApi<VyrobniZavodDropDownItem>>(`${this.area}/VyrobniZavod/Grid`);
  }
  vyrobniLinka(): Response<TableApi<VyrobniLinkaDropDownItem>> {
    return this.fetch<TableApi<VyrobniLinkaDropDownItem>>(`${this.area}/${this.controller}/Grid`);
  }
  verze(): Response<TableApi<VerzeDropDownItem>> {
    return this.fetch<TableApi<VerzeDropDownItem>>(`${this.area}/${this.controller}/Verze/Grid`);
  }
}

export const apiProvider = new KonfiguraceProvider(NAME, 'Ciselniky', 'Konfigurace');
