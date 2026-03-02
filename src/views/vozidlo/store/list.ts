import { useAuthorization } from '@/template/account/authorization/provider';
import type { DropdownItem } from '@/template/page/@types/mode';
import { Page } from '@/template/page/@types/page';
import type { ActionOptions, PageActionsGlobal, PageGetters } from '@/template/page/@types/store';
import { listName, STORE_TABLE } from '@/template/page/constants';
import { pageStoreFactory } from '@/template/page/store';
import { EnumStatusIo, statusIoList } from '@/views/chyby/constants';
import { apiProvider as apiProviderPracoviste } from '@/views/vyrobniLinka/pracoviste/api';
import { apiProvider as apiProviderSegment } from '@/views/vyrobniLinka/segment/api';
import { apiProvider } from '../api';
import { NAME } from '../constants';
import { table } from '../tables/table';
import { Interval } from '@/template/components/@types';

export const server = {
  knr: null as number | null,
  vin: null as string | null,
  modelovaTridaKod: [] as string[],
  prCisloKod: [] as string[],
  idChyby: [],
  mistoTestu: [],
  ridiciJednotkaNdNr: null as string | null,
  ridiciJednotkaSwVersion: null as number | null,
  statusTestu: [],
  vyrobniLinkaId: null as number | null,
  vyrobniLinkaSegmentId: null as number | null,
  vyrobniLinkaPracovisteId: [] as number[],
  testDatum: new Interval(),
  statusIoEnum: [] as EnumStatusIo[] | null,
  vyrazeno: false,
};

export const local = {
  vyrobniLinkaSegmentList: [] as DropdownItem[],
  vyrobniLinkaPracovisteList: [] as (DropdownItem & { vyrobniLinkaSegmentId: number })[],
  statusIoList,
};

export const props = {};

export const tables = {
  [STORE_TABLE]: table,
};

type Server = typeof server;
type Local = typeof local;
type Props = typeof props;
type Tables = typeof tables;

type ExtraActions = { loadOnLinkaChange(): Promise<void> } & PageActionsGlobal<Server, Local, Props, Tables>;
type ExtraGetters = PageGetters<Server, Local, Props, Tables>;

const extraActions = {
  async filter(filter: Record<string, unknown>) {
    const { user } = useAuthorization();
    if (!this.last) return;
    this.last.serverData.vyrobniLinkaId = user.value?.vyrobniLinkaId ?? null;
    this.loadOnLinkaChange();
  },
  async loadOnLinkaChange() {
    if (this.last) {
      const { vyrobniLinkaId } = this.last.serverData;
      if (!vyrobniLinkaId) return;
      const respontSegment = await apiProviderSegment.getDropDownList({ vyrobniLinkaId });
      this.last.localData.vyrobniLinkaSegmentList = respontSegment?.data ?? [];
      const respontPracoviste = await apiProviderPracoviste.getDropDownList({ vyrobniLinkaId });
      this.last.localData.vyrobniLinkaPracovisteList = respontPracoviste?.data ?? [];
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
