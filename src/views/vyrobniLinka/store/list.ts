import { useAuthorization } from '@/template/account/authorization/provider';
import { useLogger } from '@/template/logger';
import { Page } from '@/template/page/@types/page';
import type { ActionOptions, PageActionsGlobal, PageGetters } from '@/template/page/@types/store';
import { listName } from '@/template/page/constants';
import { pageStoreFactory } from '@/template/page/store';
import _ from 'lodash';
import { apiProvider } from '../api';
import { NAME } from '../constants';
import { table } from '../tables/';
import type { VerzeDropDownItem, VyrobniZavodDropDownItem } from '../type';

export const server = {
  vyrobniZavod: null as number | null,
  vyrobniLinkaId: null as number | null,
  verze: null as number | null,
};

export const local = {
  vyrobniZavodList: [] as VyrobniZavodDropDownItem[],
  verzeList: [] as VerzeDropDownItem[],
};

export const props = {};

export const tables = {
  table,
};

type Server = typeof server;
type Local = typeof local;
type Props = typeof props;
type Tables = typeof tables;

const { log } = useLogger();
type ExtraActions = { getVerze(): Promise<void> } & PageActionsGlobal<Server, Local, Props, Tables>;
type ExtraGetters = PageGetters<Server, Local, Props, Tables>;

const extraActions = {
  async getVerze() {
    try {
      this.startLoading();
      if (!this.last || !apiProvider) return;
      const entity = this.last;
      const verzeResponse = await apiProvider.verze();
      entity.localData.verzeList = verzeResponse?.data.rows.map((r) => ({ ...r, value: r.verze, text: r.verze.toString() })) ?? [];
    } catch (error) {
      log('getVerze');
    } finally {
      this.endLoading();
    }
  },
  async filter(filter: Record<string, unknown>) {
    try {
      this.startLoading();
      if (!this.last || !apiProvider) return;
      const entity = this.last;
      const userStore = useAuthorization();
      entity.serverData.vyrobniLinkaId = userStore.user.value?.vyrobniLinkaId ?? null;
      const [response, vyrobniZavodResponse] = await Promise.allSettled([apiProvider.filter(), apiProvider.vyrobniZavod()]);
      await this.getVerze();
      response.status === 'fulfilled' && _.set(entity, 'serverData', response.value?.data);
      if (vyrobniZavodResponse.status === 'fulfilled' && vyrobniZavodResponse.value?.data)
        entity.localData.vyrobniZavodList = vyrobniZavodResponse.value?.data.rows.map((r) => ({ ...r, value: r.id })) ?? [];
      return response;
    } catch (error) {
      log('filter');
    } finally {
      this.endLoading();
    }
  },
} as ActionOptions<typeof name, Server, Local, Props, Tables, ExtraGetters, ExtraActions>;

const name = listName(NAME);

const page = new Page(name, server, local, props, tables);

export const useStore = pageStoreFactory({
  name,
  apiProvider,
  page,
  extraGetters: {},
  extraActions,
});
