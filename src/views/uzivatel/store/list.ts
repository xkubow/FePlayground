import { Page } from '@/template/page/@types/page';
import type { ActionOptions, PageActionsGlobal, PageGetters } from '@/template/page/@types/store';
import { listName } from '@/template/page/constants';
import { pageStoreFactory } from '@/template/page/store';
import { apiProvider } from '../api';
import { NAME } from '../constants';
import { table } from '../tables';
import { apiProvider as uzivatelSkupinaApiProvider } from '@/views/uzivatel/skupina/api';
import { Table } from '@/template/components/table';
import type { SkupinaDropDown } from '@/views/eskalace/type';
import { STORE_TABLE } from '@/template/page/constants';
import { useLogger } from '@/template/logger';
import type { Uzivatel } from '@/views/uzivatel/type';
import { Interval } from '@/template/components/@types';

export const server = {
  skupinaUzivateluId: null as number | null,
  skupinaUzivateluIdIn: false as boolean,
  zobrazeneJmeno: null as string | null,
  eskalaceId: null as number | null,
  prirazenoEskalaceIdIn: null as boolean | null,
  schvalujeEskalaceIdIn: null as boolean | null,
  oddeleni: null as string | null,
  vyrobniLinkaId: null as number | null,
  station: null as boolean | null,
  id: null as string | null,
  zkusenost: new Interval<number>(),
  dzc: null as string | null,
  mfaPerNr: null as string | null,
};

export const local = {
  uzivatelSkupinaList: [] as SkupinaDropDown[],
  uzivatelId: [] as string[],
  uzivatelIdList: [] as Uzivatel[],
};

export const props = {
  skupinaUzivateluId: null as number | null,
};

export const tables = {
  table,
};

type Server = typeof server;
type Local = typeof local;
type Props = typeof props;
type Tables = typeof tables;

type ExtraActions = PageActionsGlobal<Server, Local, Props, Tables>;
type ExtraGetters = PageGetters<Server, Local, Props, Tables>;

const extraActions = {
  async filter(filter: Record<string, unknown>) {
    if (!this.last) return;
    const logger = useLogger();
    try {
      const uzivatelSkupinaResponse = await uzivatelSkupinaApiProvider.tableData<Table<SkupinaDropDown>>({ tableName: STORE_TABLE });

      this.last.localData.uzivatelSkupinaList = uzivatelSkupinaResponse?.data.rows ?? [];
    } catch (err) {
      logger.log('nacitanie dat uzivatelu pre eskalace');
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
