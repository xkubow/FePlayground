import { Page } from '@/template/page/@types/page';
import type { ActionOptions } from '@/template/page/@types/store';
import { editName, STORE_TABLE } from '@/template/page/constants';
import { pageStoreFactory } from '@/template/page/store';
import type { _GettersTree } from 'pinia';
import { apiProvider } from '../api';
import { EnumVraceniBaterieStatus, NAME, vraceniBaterieStatusList, vraceniBaterieStavList } from '../constants';
import { NAME as KOMENTAR_NAME } from '@/views/komentar/constants';
import { table as tableKomentar } from '@/views/komentar/tables/komentare';
import type { SkupinaDropDown } from '@/views/eskalace/type';
import type { DropdownItem } from '@/template/page/@types/mode';
import type { UnknownObject } from '@/template/@types/kTemplate';
import { dataMapper } from '@/template/utils/dataMapper';
import _ from 'lodash';
import { useLogger } from '@/template/logger';
import { apiProvider as uzivatelSkupinaApiProvider } from '@/views/uzivatel/skupina/api';
import type { Table } from '@/template/components/table';
import hash from 'object-hash';
import { apiProviderVraceniBaterieKomentar } from '@/views/komentar/api';
import { apiProviderNahradniNd } from '@/views/prilohy/api';
import { NAME as PRILOHA_NAME } from '@/views/prilohy/constants';
import { table as prilohaTable } from '@/views/prilohy/table';
import { useRoute } from 'vue-router';

export const server = {
  id: null as number | null,
  ndNr: null as string | null,
  bg: null as string | null,
  fazitId: null as string | null,
  swVersion: null as number | null,
  hwVersion: null as string | null,
  eskalaceId: null as number | null,
  vozidloKnr: null as number | null,
  uzivatelPrirazeno: [] as string[],
  prirazenaSkupinaUzivateluId: null as number | null,
  vraceniBaterieStatusEnum: null as number | null,
  text: null as string | null,
  vyrobniLinkaId: null as number | null,
  uzivatelPrirazenoDropDownList: [] as DropdownItem<string>[],
  vraceniBaterieStav: null as EnumVraceniBaterieStatus | null,
  typBaterieId: null as number | null,
};
export const local = {
  uzivatelSkupinaList: [] as SkupinaDropDown[],
  vraceniBaterieStatusEnumDropDownList: vraceniBaterieStatusList,
  vraceniBaterieStavList,
};
export const props = {};

export const tables = {
  [KOMENTAR_NAME]: tableKomentar,
  [PRILOHA_NAME]: prilohaTable,
};

const name = editName(NAME);

const page = new Page(name, server, local, props, tables);

const extraGetters: _GettersTree<typeof page> = {};

const extraActions = {
  async default(filter: Record<string, unknown>) {
    const route = useRoute();
    const entity = _.last(this.entity);

    if (route.params.eskalaceId) {
      const response = await apiProvider?.default({ eskalaceId: route.params.eskalaceId });
      if (entity) {
        _.merge(entity.serverData, response?.data);
        entity.serverData.eskalaceId = parseInt(route.params.eskalaceId.toString());
      }
    }
    await this.loadUzivatel();
  },
  async tableData<K extends keyof typeof tables>({ filter, tableName }: { filter?: Record<string, unknown>; tableName: K }) {
    const entity = _.last(this.entity);
    if (!entity) throw new Error('Entity doesnt exists');
    const table: Table = entity.tables[tableName];

    try {
      if (!table) throw new Error('Table doesnt exists');
      table.startLoading();
      switch (tableName) {
        case KOMENTAR_NAME:
          await this.loadKomentar();
          break;
        case PRILOHA_NAME:
          await this.loadPrilohy();
          break;
      }
    } finally {
      table.endLoading();
    }
  },
  async loadEntity(params: { id: string | number }) {
    const response = await apiProvider?.loadEntity<UnknownObject>(params.id);
    const entity = _.last(this.entity);
    if (!entity) return;
    response?.data && dataMapper(entity.serverData, response?.data);
    await this.loadUzivatel();
    // entity.tables[NAVRHOVANE].rows = test.rows;
    await this.loadKomentar();
    await this.loadPrilohy();
    this.tableData({ tableName: KOMENTAR_NAME });
    entity.hash = hash(entity.localData);
    return response;
  },
  async loadUzivatel() {
    const entity = _.last(this.entity);
    if (!entity) return;
    const logger = useLogger();
    try {
      const uzivatelSkupinaResponse = await uzivatelSkupinaApiProvider.tableData<Table<SkupinaDropDown>>({ tableName: STORE_TABLE });

      entity.localData.uzivatelSkupinaList = uzivatelSkupinaResponse?.data.rows ?? [];
    } catch (err) {
      logger.log('nacitanie dat uzivatelu pre eskalace');
    }
  },
  async loadKomentar() {
    const entity = _.last(this.entity);
    if (!entity || !entity.id) return;
    const response = await apiProviderVraceniBaterieKomentar.getByMasterId(entity.id as number);
    if (response?.data.rows) entity.tables[KOMENTAR_NAME].rows = response?.data.rows;
  },
  async loadPrilohy() {
    const entity = _.last(this.entity);
    if (!entity || !entity.id) return;
    // const response = await apiProvider.tableData<TablePriloha>({
    // 	filter: { vraceniBaterieId: entity.id },
    // 	tableName: 'Priloha/',
    // 	options: { showError: true, cancelPrevious: false },
    // });
    const response = await apiProviderNahradniNd.getByMasterId(entity.id as number);
    if (response?.data) entity.tables[PRILOHA_NAME].rows = response?.data.rows;
  },
} as {
  // loadEskalaceData(eskalaceId: number): Promise<void>;
  loadKomentar(): Promise<void>;
  loadPrilohy(): Promise<void>;
  // loadEskalaceChangeLog(eskalaceId: number): Promise<void>;
  loadUzivatel(forceLoad?: boolean): Promise<void>;
} & ActionOptions<typeof name, typeof server, typeof local, typeof props, typeof tables>;

export const useStore = pageStoreFactory({
  name,
  apiProvider,
  page,
  extraGetters,
  extraActions,
});
