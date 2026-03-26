import type { UnknownObject } from '@/template/@types/kTemplate';
import { Table } from '@/template/components/table';
import { useLogger } from '@/template/logger';
import type { TableOptions } from '@/template/page/@types/api';
import { Page } from '@/template/page/@types/page';
import type { ActionOptions } from '@/template/page/@types/store';
import { editName, STORE_TABLE } from '@/template/page/constants';
import { pageStoreFactory } from '@/template/page/store';
import { dataMapper } from '@/template/utils/dataMapper';
import type { EnumStatusIo } from '@/views/chyby/constants';
import { table as tableRidiciJednotkaInfo } from '@/views/chyby/tables/ridiciJednotka';
import { table as tableChyby } from '@/views/chyby/tables/table';
import { table as tablePrCislo } from '@/views/ciselniky/prCislo/tables';
import { apiProvider as eskalaceApiProvider } from '@/views/eskalace/api';
import { EnumEskalaceDialogType, EnumEskalaceStatus } from '@/views/eskalace/constants';
import type { Eskalace, SkupinaDropDown } from '@/views/eskalace/type';
import { NAME as KOMENTAR_NAME } from '@/views/komentar/constants';
import { table as tableKomentar } from '@/views/komentar/tables/komentare';
import { apiProvider as uzivatelSkupinaApiProvider } from '@/views/uzivatel/skupina/api';
import { apiProvider as vozidloStitekApiProvider } from '@/views/vozidloStitek/api/vozidloVozidloStitek';
import { table as vozidloStitek } from '@/views/vozidloStitek/tables';
import { last } from 'lodash-es';
import type { _GettersTree } from 'pinia';
import { table as tablePrilohy } from '../../prilohy/table';
import { apiProvider } from '../api';
import { NAME, SEMAFOR } from '../constants';
import { table as tableSemafor } from '../tables/semafor';
import { table as sqsZavady } from '../tables/sqsZavady';
import { table as casOpravy } from '../tables/casOpravy';
import { table as tableZavada } from '../zavada/tables/table';
import { table as navrhovane, NAME as NAVRHOVANE } from '../zavada/navrhovane/tables/table';
import type { Row } from '@/template/components/table/@types/table';
import hash from 'object-hash';
import type { Komentar, LoadEskalaceKomentar } from '@/views/komentar/type';
import { apiProviderEskalaceKomentar } from '@/views/komentar/api';
import type { NavrhovanaZavadaSelected, SystemPohonu } from '../type';
import { apiProvider as vraceniBaterieApiProvider } from '../../vraceniBaterie/api';
import type { VraceniBaterie } from '@/views/vraceniBaterie/type';

export const server = {
  statusIoEnum: null as EnumStatusIo | null,
  modelText: null as string | null,
  vstupDatum: null as Date | null,
  editDatum: null as Date | null,
  vyrobaDatum: null as Date | null,
  knr: null as number | null,
  vin: null as string | null,
  linka: null as string | null,
  modelovyKlicKod: null as string | null,
  eskalaceEditDatum: null as Date | null,
  m100CisloZavesu: null as number | null,
  motorText: null as string | null,
  zakladniMotorText: null as string | null,
  prevodovkaText: null as string | null,
  operationEskalaceCreate: null as boolean | null,
  operationVozidloStitekUpdate: null as boolean | null,
  fin: null as boolean | null,
  zavadaVN: null as boolean | null,
  operationEskalaceZnovuotevreni: false as boolean | null,
  operationDeletePriloha: false as boolean | null,
  baterieVyjmuta: false as boolean | null,
  systemPohonu: null as SystemPohonu | null,
};

export const local = {
  activeTabName: 'HlavniUdaje',
  eskalace: [] as Eskalace[],
  currentEskalace: 0 as number,
  komentare: [] as Komentar[],
  uzivatelSkupinaList: [] as SkupinaDropDown[],
  createEskalaceDialog: {
    visible: false,
    type: EnumEskalaceDialogType.KSchvaleni,
  },
  vozidloStitek: [] as number[],
  navrhovanaZavadaSelected: null as NavrhovanaZavadaSelected | null,
  testRepetionCount: 0,
};
export const props = {};

export const tables = {
  chyby: new Table({ ...tableChyby, selectable: false, filterMapper: (payload) => ({ knr: payload.serverData.knr ?? -1 }) }),
  [KOMENTAR_NAME]: new Table({ ...tableKomentar, filterMapper: (payload) => ({ knr: payload.serverData.knr ?? -1 }) }),
  prCislo: tablePrCislo,
  ridiciJednotkaInfo: tableRidiciJednotkaInfo,
  zavada: tableZavada,
  [NAVRHOVANE]: navrhovane,
  sqsZavady,
  [SEMAFOR]: tableSemafor,
  priloha: new Table({ ...tablePrilohy, filterMapper: (payload) => ({ knr: payload.serverData.knr ?? -1 }) }),
  vozidloStitek,
  casOpravy,
};

const name = editName(NAME);

const page = new Page(name, server, local, props, tables);

export type PageType = typeof page;

const extraGetters: _GettersTree<PageType> = {};

const extraActions = {
  async loadEntity(params: { id: string | number }) {
    const response = await apiProvider?.loadEntity<UnknownObject>(params.id);
    const entity = last(this.entity);
    if (!entity) return;
    response?.data && dataMapper(entity.serverData, response?.data);
    await this.loadEskalace();
    const stitkyResponse = await vozidloStitekApiProvider.List(parseInt(entity.id as string));
    stitkyResponse?.data && (entity.localData.vozidloStitek = stitkyResponse.data);
    // entity.tables[NAVRHOVANE].rows = test.rows;
    return response;
  },
  async loadEskalace(forceLoad = false) {
    const entity = last(this.entity);
    if (!entity) return;
    const logger = useLogger();
    try {
      const uzivatelSkupinaResponse = await uzivatelSkupinaApiProvider.tableData<Table<SkupinaDropDown>>({ tableName: STORE_TABLE });

      entity.localData.uzivatelSkupinaList = uzivatelSkupinaResponse?.data.rows ?? [];
    } catch (err) {
      logger.log('nacitanie dat uzivatelu pre eskalace');
    }
    // if (!forceLoad && !entity.serverData.eskalaceEditDatum) return;
    const eskalaceResponse = await eskalaceApiProvider.getByMasterId<Eskalace[]>(entity.serverData.knr as number);
    if (eskalaceResponse?.data) {
      entity.localData.eskalace = eskalaceResponse.data as Eskalace[];
      if (entity.localData.currentEskalace == 0)
        entity.localData.currentEskalace = entity.localData.eskalace.findIndex((p) => p.eskalaceStatusEnum != EnumEskalaceStatus.Uzavrena) + 1;
      entity.localData.currentEskalace = entity.localData.currentEskalace == 0 ? 1 : entity.localData.currentEskalace;
    }
    if (entity.localData.eskalace.length) {
      const eskalaceKomentrRequests = entity.localData.eskalace.map((eskalace) => this.loadEskalaceData(eskalace.id));
      await Promise.all(eskalaceKomentrRequests);
      this.tableData({ tableName: KOMENTAR_NAME });
    }
    entity.hash = hash(entity.localData.eskalace);
  },
  async tableData<K extends keyof typeof tables>({ filter, tableName }: { filter?: Record<string, unknown>; tableName: K }) {
    const entity = last(this.entity);
    if (!entity) throw new Error('Entity doesnt exists');
    const table: Table = entity.tables[tableName];
    let tableFilter: Record<string, unknown> | undefined = filter ?? table.filter ?? entity.serverData;
    try {
      if (!table) throw new Error('Table doesnt exists');
      table.startLoading();

      const tableOptions: TableOptions = table.tableOptions();
      if (table.filterMapper) {
        tableFilter = table.filterMapper({ ...entity });
      }
      const response = await apiProvider?.tableData<{ rows: Record<string, unknown>[]; totalCount: number; operations?: number }>({
        tableName,
        filter: { ...filter, ...tableFilter },
        tableOptions,
      });
      if (response) {
        switch (tableName) {
          case KOMENTAR_NAME:
            table.rows = response.data.rows.map((r) => ({ ...r, vstupDatum: new Date(r.vstupDatum as string) }));
            break;
          case SEMAFOR:
            table.rows = response.data as any;
            break;
          default:
            table.rows = response.data.rows;
        }
        table.totalCount = response.data.totalCount;
        'operations' in response.data && (table.operations = response.data.operations);
      }
      return response;
    } finally {
      table.endLoading();
    }
  },
  parseRow(tableName: string, rows: Row[]) {
    if (tableName === 'navrhovane') {
      return rows;
    }
    return rows;
  },
  async loadEskalaceKomentar(eskalaceId: number) {
    const entity = last(this.entity);
    if (!entity) return;
    const response = await apiProviderEskalaceKomentar.getByMasterId(eskalaceId);
    const eskalace = entity.localData.eskalace.find((p) => p.id === eskalaceId);
    eskalace && (eskalace.komentare = response?.data);
  },
  async loadEskalaceData(eskalaceId) {
    const entity = last(this.entity);
    if (!entity) return;
    await this.loadEskalaceKomentar(eskalaceId);
    await this.loadEskalacePrilohy(eskalaceId);
    await this.loadEskalaceChangeLog(eskalaceId);
    await this.loadVraceniBaterie(eskalaceId);
    const eskalace = entity.localData.eskalace.find((p) => p.id === eskalaceId);
    if (!eskalace) return;

    // const eskalacePriradeniResponse = await uzivatelApiProvider.tableData<Table<Uzivatel>>({
    // 	filter: { eskalaceId: eskalace.id, prirazenoEskalaceIdIn: true },
    // 	tableName: STORE_TABLE,
    // 	options: { showError: true, cancelPrevious: false },
    // });
    // if (eskalacePriradeniResponse?.data) {
    // 	eskalace.uzivatelPrirazenoDropDownList = eskalacePriradeniResponse.data.rows.map(
    // 		(p) => ({ text: `${p.zobrazeneJmeno}`, value: p.id } as DropdownItem<string>),
    // 	);
    // 	eskalace.uzivatelPrirazeno = eskalacePriradeniResponse.data.rows.map((i) => i.id);
    // }

    // const eskalaceSchvaleniResponse = await uzivatelApiProvider.tableData<Table<Uzivatel>>({
    // 	filter: { eskalaceId: eskalace.id, schvalujeEskalaceIdIn: true },
    // 	tableName: STORE_TABLE,
    // 	options: { showError: true, cancelPrevious: false },
    // });
    // if (eskalaceSchvaleniResponse?.data) {
    // 	eskalace.uzivatelSchvalujeDropDownList = eskalaceSchvaleniResponse.data.rows.map(
    // 		(p) => ({ text: `${p.zobrazeneJmeno}`, value: p.id } as DropdownItem<string>),
    // 	);
    // 	eskalace.uzivatelSchvaluje = eskalaceSchvaleniResponse.data.rows.map((i) => i.id);
    // }
  },
  async loadEskalacePrilohy(eskalaceId) {
    const entity = last(this.entity);
    if (!entity) return;
    const response = await eskalaceApiProvider.tableData({
      filter: { eskalaceId },
      tableName: 'Priloha/',
      options: { showError: true, cancelPrevious: false },
    });
    const eskalace = entity.localData.eskalace.find((p) => p.id === eskalaceId);
    eskalace && (eskalace.priloha = response?.data);
  },
  async loadEskalaceChangeLog(eskalaceId) {
    const entity = last(this.entity);
    if (!entity) return;
    const response = await eskalaceApiProvider.tableData({
      filter: { eskalaceId },
      tableName: 'ChangeLog/',
      options: { showError: true, cancelPrevious: false },
    });
    const eskalace = entity.localData.eskalace.find((p) => p.id === eskalaceId);
    eskalace && (eskalace.changeLog = response?.data);
  },
  async loadVraceniBaterie(eskalaceId) {
    const entity = last(this.entity);
    if (!entity) return;
    const eskalace = entity.localData.eskalace.find((p) => p.id === eskalaceId);
    if (!eskalace?.vraceniBaterieId) return;
    const vraceniBaterieResponse = await vraceniBaterieApiProvider.loadEntity<VraceniBaterie>(eskalace?.vraceniBaterieId);
    if (vraceniBaterieResponse?.data) eskalace.vraceniBaterie = vraceniBaterieResponse.data;
  },
  async loadVozidloEntity(params: { id: string | number }) {
    const response = await apiProvider?.loadEntity<UnknownObject>(params.id);
    const entity = last(this.entity);
    if (!entity) return;
    response?.data && dataMapper(entity.serverData, response?.data);
  },
} as {
  loadEskalaceData(eskalaceId: number): Promise<void>;
  loadEskalaceKomentar: LoadEskalaceKomentar;
  loadEskalacePrilohy(eskalaceId: number): Promise<void>;
  loadVraceniBaterie(eskalaceId: number): Promise<void>;
  loadEskalaceChangeLog(eskalaceId: number): Promise<void>;
  loadEskalace(forceLoad?: boolean): Promise<void>;
  loadVozidloEntity(params: { id: string | number }): Promise<void>;
} & ActionOptions<typeof name, typeof server, typeof local, typeof props, typeof tables>;
// & {};

export const useStore = pageStoreFactory({
  name,
  apiProvider,
  page,
  extraGetters,
  extraActions,
});
