import type { UnknownObject } from '@/template/@types/kTemplate';
import { useStore as useCacheStore } from '@/template/cache';
import type { Row } from '@/template/components/table/@types/table';
import type { DropdownItem } from '@/template/page/@types/mode';
import { Page } from '@/template/page/@types/page';
import type { ActionOptions, PageActionsGlobal, PageGetters } from '@/template/page/@types/store';
import { editName } from '@/template/page/constants';
import { pageStoreFactory } from '@/template/page/store';
import { dataMapper } from '@/template/utils/dataMapper';
import { table as tableRidiciJednotkaInfo } from '@/views/chyby/tables/ridiciJednotka';
import { table as tableChyby } from '@/views/chyby/tables/table';
import type { ChybaId, Detail, RowChyby } from '@/views/chyby/type';
import _ from 'lodash';
import type { _GettersTree } from 'pinia';
import { apiProvider } from '../api';
import { EnumSqsZavadaKategorie, NAME } from '../constants';
import { type NavrhovaneZavady, table as navrhovane, NAME as NAVRHOVANE } from '../navrhovane/tables/table';
import { useStore as useStoreVozidlo } from '../../store/edit';
import { Table } from '@/template/components/table';
import { table as casOpravy, type CasOpravyZavada } from '../tables/casOpravyZavada';
import { Interval } from '@/template/components/@types';
import { NAME_CAS_OPRAVY } from '../../constants';
// import test from '../../store/test.json';

const dropDownLists = {
  pracovisteVznikuZavady: [] as DropdownItem[],
  pracovisteZadaniZavady: [] as DropdownItem[],
};
const server = {
  id: null as number | null,
  opravenoDatum: null as Date | null,
  odeslanoDoSqsDatum: null as Date | null,
  pracovisteVznikuZavadyArcId: null as number | null,
  pracovisteZadaniZavadyArcId: null as number | null,
  text: null as string | null,
  knr: null as number | null,
  vyrazenoDatum: null as Date | null,
  chyby: [] as ChybaId[],
  zpusobOpravy: null as string | null,
  sqsZavadaKategorieId: EnumSqsZavadaKategorie.Elektricka as number | null,
  sqsZavadaSkupinaId: null as number | null,
  sqsZavadaRadekId: null as number | null,
  sqsZavadaTypId: null as number | null,
  sqsZavadaVinikId: null as number | null,
  definiceZavadyId: null as number | null,
  isFromNavrhovane: false,
  navrhAi: [] as NavrhovaneZavady[],
};
const makeServer = () =>
  ({
    id: null as number | null,
    opravenoDatum: null as Date | null,
    odeslanoDoSqsDatum: null as Date | null,
    pracovisteVznikuZavadyArcId: null as number | null,
    pracovisteZadaniZavadyArcId: null as number | null,
    text: null as string | null,
    knr: null as number | null,
    vyrazenoDatum: null as Date | null,
    chyby: [] as ChybaId[],
    zpusobOpravy: null as string | null,
    sqsZavadaKategorieId: EnumSqsZavadaKategorie.Elektricka as number | null,
    sqsZavadaSkupinaId: null as number | null,
    sqsZavadaRadekId: null as number | null,
    sqsZavadaTypId: null as number | null,
    sqsZavadaVinikId: null as number | null,
    definiceZavadyId: null as number | null,
    isFromNavrhovane: false,
    navrhAi: [] as NavrhovaneZavady[],
  }) as S;
const local = {
  dropDownLists,
  dobaOpravyMinuty: null as number | null,
  intervalOpravy: new Interval<Date | null>() as Interval<Date | null>,
  casOpravyText: null as string | null,
}; //, sqsZavadaSkupinaDisabled: true, sqsZavadaRadekDisabled: true };

const props = {
  isFromNavrhovane: false,
  vozidloId: null as string | null,
  knr: null as number | null,
  definiceZavadyId: null as string | null,
  rowNumber: null as string | null,
  sqsZavadaSkupinaId: null as number | null,
  sqsZavadaTypId: null as number | null,
  sqsZavadaVinikId: null as number | null,
  sqsZavadaRadekId: null as number | null,
};

const tables = {
  chyby: tableChyby,
  ridiciJednotkaInfo: tableRidiciJednotkaInfo,
  [NAVRHOVANE]: new Table<NavrhovaneZavady>({
    ...navrhovane,
    loadByEntityId: true,
    filterMapper: (payload) => ({
      vozidloZavadaId: payload.serverData.id,
    }),
  }),
  [NAME_CAS_OPRAVY]: new Table<CasOpravyZavada>({
    ...casOpravy,
    filterMapper: (payload) => ({
      vozidloZavadaId: payload.serverData.id,
    }),
  }),
};
const makeTables = () =>
  ({
    chyby: tableChyby,
    ridiciJednotkaInfo: tableRidiciJednotkaInfo,
    [NAVRHOVANE]: new Table<NavrhovaneZavady>({
      ...navrhovane,
      filterMapper: (payload) => ({
        vozidloZavadaId: payload.serverData.id,
      }),
    }),
    [NAME_CAS_OPRAVY]: new Table<CasOpravyZavada>({
      ...casOpravy,
      filterMapper: (payload) => ({
        vozidloZavadaId: payload.serverData.id,
      }),
    }),
  }) as T;

const name = editName(NAME);

const page = new Page(name, makeServer(), local, props, makeTables());

type N = typeof name;
export type S = typeof server;
type L = typeof local;
type P = typeof props;
type T = typeof tables;

const extraGetters: _GettersTree<typeof page> = {};

type A = {
  prerequisite(filter: { knr: number }): Promise<void>;
};

const extraActions = {
  async prerequisite(filter: { knr: number }) {
    const { knr } = filter;
    const pracovisteVznikuZavadyResponse = (await apiProvider?.pracovisteVznikuZavadyDropDownList(knr)) as { data: DropdownItem[] };
    const pracovisteZadaniZavadyResponse = (await apiProvider?.pracovisteZadaniZavadyDropDownList(knr)) as { data: DropdownItem[] };

    const entity = _.last(this.entity);
    if (entity) {
      entity.localData.dropDownLists.pracovisteVznikuZavady = pracovisteVznikuZavadyResponse?.data ?? [];
      entity.localData.dropDownLists.pracovisteZadaniZavady = pracovisteZadaniZavadyResponse?.data ?? [];
    }
    if (entity?.serverData.sqsZavadaSkupinaId || entity?.serverData.sqsZavadaRadekId) {
      const cache = useCacheStore();

      if (entity.serverData.sqsZavadaRadekId && entity.serverData.sqsZavadaSkupinaId === null) {
        entity.serverData.sqsZavadaSkupinaId =
          cache.dropDownList.sqsZavadaRadek.find((i) => i.value === entity.serverData.sqsZavadaRadekId)?.sqsZavadaSkupinaId ?? null;
      }
      if (entity.serverData.sqsZavadaSkupinaId)
        entity.serverData.sqsZavadaKategorieId =
          cache.dropDownList.sqsZavadaSkupina.find((i) => i.value === entity.serverData.sqsZavadaSkupinaId)?.sqsZavadaKategorieEnum ?? null;
    }
    return Promise.resolve();
  },
  async default(filter: P) {
    const { vozidloId, knr } = filter;
    const entity = this.last; //_.last(this.entity);
    if (entity) {
      entity.serverData.knr = vozidloId ? parseInt(vozidloId, 10) : knr!;
      const response = await apiProvider?.default({ ...filter, knr: entity.serverData.knr });
      // const entity = _.last(this.entity);
      // entity && _.set(entity, 'serverData', response?.data);
      entity && _.merge(entity.serverData, response?.data);

      this.prerequisite({ knr: entity?.serverData.knr });
      // if (entity.props.isFromNavrhovane) {
      const vozidloStore = useStoreVozidlo();
      const vozidloEntity = vozidloStore.last;
      entity.serverData.navrhAi = (vozidloEntity?.tables.navrhovane.rows ?? []).slice();
      const navrhovanaZavadaSelect = vozidloEntity?.localData.navrhovanaZavadaSelected;
      if (entity.serverData.navrhAi.length > 0 && navrhovanaZavadaSelect) {
        const main = entity.serverData.navrhAi.find((p) => p.definiceZavadyId === navrhovanaZavadaSelect.definiceZavadyId);
        const detail = main?.detail.find((p) => p.rowNumber === navrhovanaZavadaSelect.rowNumber);
        detail && (detail.selected = true);
        entity.tables[NAVRHOVANE].rows = entity.serverData.navrhAi;
        entity.props.isFromNavrhovane = true;
        entity.serverData.isFromNavrhovane = true;
        entity.serverData.sqsZavadaSkupinaId = navrhovanaZavadaSelect.sqsZavadaSkupinaId;
        entity.serverData.definiceZavadyId = navrhovanaZavadaSelect.definiceZavadyId;
        entity.serverData.sqsZavadaTypId = navrhovanaZavadaSelect.sqsZavadaTypId;
        entity.serverData.sqsZavadaVinikId = navrhovanaZavadaSelect.sqsZavadaVinikId;
        entity.serverData.sqsZavadaRadekId = navrhovanaZavadaSelect.sqsZavadaRadekId;
      }
      if (navrhovanaZavadaSelect) vozidloEntity.localData.navrhovanaZavadaSelected = null;

      entity.localData.intervalOpravy.do = new Date();
      entity.localData.intervalOpravy.od = null;
      entity.localData.dobaOpravyMinuty = null;
      // }
      // entity.tables[NAVRHOVANE].rows = test.rows;
      return response;
    }
    return Promise.reject({});
  },
  async loadEntity(params: { id: string }) {
    const response = await apiProvider?.loadEntity<UnknownObject>(params.id);
    const entity = _.last(this.entity);
    if (response?.data.knr) await this.prerequisite({ knr: response?.data.knr as number });
    if (entity && response?.data) {
      entity.operations = (response?.data?.operations as number) ?? null;
      dataMapper(entity.serverData, response?.data);
      const cacheStore = useCacheStore();

      if (entity.serverData.sqsZavadaRadekId && entity.serverData.sqsZavadaSkupinaId === null) {
        entity.serverData.sqsZavadaSkupinaId =
          cacheStore.dropDownList.sqsZavadaRadek.find((i) => i.value === entity.serverData.sqsZavadaRadekId)?.sqsZavadaSkupinaId ?? null;
        // entity.localData.sqsZavadaRadekDisabled = entity.serverData.sqsZavadaSkupinaId === null;
      }
      if (entity.serverData.sqsZavadaSkupinaId && entity.serverData.sqsZavadaKategorieId === null) {
        entity.serverData.sqsZavadaKategorieId =
          cacheStore.dropDownList.sqsZavadaSkupina.find((i) => i.value === entity.serverData.sqsZavadaSkupinaId)?.sqsZavadaKategorieEnum ?? null;
        // entity.localData.sqsZavadaSkupinaDisabled = entity.serverData.sqsZavadaKategorieId === null;
      }
    }
    return response;
  },
  parseRow(tableName: string, rows: Row[]) {
    if (tableName === 'chyby') {
      const entity = this.last;
      if (entity) {
        (rows as Row<RowChyby>[]).forEach((r) => {
          if (entity.id)
            r.detail.forEach((d: Detail) => {
              const indexZavadaId = d.detail.findIndex((i) => i.vozidloZavadaId === parseInt(entity.id as string));
              if (indexZavadaId !== -1) {
                d.selected = true;
                d.detail.splice(indexZavadaId, 1);
              } else d.selected = false;

              if (r.selected === undefined) r.selected = d.selected;
              else if (r.selected !== d.selected) r.selected = null;
            });
          r.detail.sort((a, b) => {
            if (a.detail.length > b.detail.length) {
              return 1;
            } else if (a.detail.length < b.detail.length) {
              return -1;
            } else {
              return 0;
            }
          });
        });
      }
    }
    return rows;
  },
} as ActionOptions<N, S, L, P, T, PageGetters<S, L, P, T>, PageActionsGlobal<S, L, P, T, A>>;

export const useStore = pageStoreFactory({
  name,
  apiProvider,
  page,
  extraGetters,
  extraActions,
});
