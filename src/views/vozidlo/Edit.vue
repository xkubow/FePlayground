<template>
  <k-layout-edit v-bind="{ leaving, canDelete: false, canSave: false }" v-on="{ ...layoutListeners }">
    <template #title> {{ t('detaiVozidla') }} </template>
    <template #actions>
      <k-actions
        class="hidden-sm-and-down"
        v-bind="{ aktualnyStatusBg, eskalaceExists: !!eskalace[0]?.knr, operationEskalaceCreate }"
        v-on="{ openTestyUps, createZavadu, createEskalaci, openPuvodniSqs, openPuvodniUps, openCarRfid, openElsa }"
      />
    </template>
    <k-card>
      <vozidlo-table
        v-bind="{ vozidlo, eskalace, vozidloStitekList: tables.vozidloStitek.rows, uzivatelSkupinaList }"
        v-model:vozidloStitek="vozidloStitek"
        v-on="{ updateStitky, updateZavadaNV, updateBaterieVyjmuta }"
        highlight
      />
      <div class="mt-10">
        <k-tabs v-model="activeTabName">
          <k-tab-panel :label="t('hlavniUdaje')" name="HlavniUdaje">
            <k-row :gutter="10">
              <k-col :xs="12" :sm="4" :md="5" :lg="3" :xl="2">
                <semafor v-model="tables.semafor.rows" :fin="fin" />
              </k-col>
              <k-col :xs="12" :sm="20" :md="19" :lg="21" :xl="22">
                <k-actions
                  class="hidden-md-and-up"
                  v-bind="{ aktualnyStatusBg, eskalaceExists: !!eskalace[0]?.knr, operationEskalaceCreate }"
                  v-on="{ openTestyUps, createZavadu, createEskalaci, openPuvodniSqs, openPuvodniUps, openCarRfid, openElsa }"
                />
                <k-row class="hidden-sm-and-down">
                  <KMainRightVue
                    v-bind="{
                      zavada: tables.zavada,
                      navrhovane: tables.navrhovane,
                      sqsZavady: tables.sqsZavady,
                      statusIoEnum,
                      casOpravy: tables.casOpravy,
                      knr,
                    }"
                    v-on="{ openVozidloZavada, refreshVozidloZavadaTable }"
                  />
                </k-row>
              </k-col>
            </k-row>
            <k-row class="hidden-md-and-up" :span="24">
              <KMainRightVue
                v-bind="{ zavada: tables.zavada, navrhovane: tables.navrhovane, sqsZavady: tables.sqsZavady, statusIoEnum, casOpravy: tables.casOpravy, knr }"
                v-on="{ openVozidloZavada, refreshVozidloZavadaTable }"
              />
            </k-row>
          </k-tab-panel>
          <k-tab-panel :label="t('testy')" name="Testy">
            <table-chyby :rows="tables.chyby.rows" :columns="tables.chyby.columns" :rjInfopRows="tables.ridiciJednotkaInfo.rows" />
          </k-tab-panel>
          <k-tab-panel :label="t('komentare')" name="Komentare">
            <k-row :gutter="4">
              <k-col :span="20">
                <frame-komentare
                  v-bind="{ rows: tables.komentar.rows, references: tables.priloha.rows, entita, parentId: knr }"
                  v-on="{ addKomentar, update: updateKomentar, delete: deleteKomentar }"
                />
              </k-col>
              <k-col :span="4">
                <div>{{ t('Prilohy') }}</div>
                <frame-prilohy v-model="tables.priloha.rows" v-bind="{ entita, parentId: knr, beforeRemove: beforeRemovePriloha, operationDeletePriloha }" />
              </k-col>
            </k-row>
          </k-tab-panel>
          <k-tab-panel :label="t('eskalace')" name="Eskalace">
            <div v-if="eskalace.length > 0">
              <k-pagination
                layout="prev, pager, next"
                v-model:current-page="currentEskalace"
                :total="eskalace.length"
                :page-size="1"
                :hide-on-single-page="true"
              />
              <k-row :gutter="4">
                <k-col :span="20">
                  <div v-if="selectedEskalace?.knr" class="el-card p-0">
                    <k-row :span="24">
                      <eskalace-frame
                        ref="eskalaceFrame"
                        v-model:eskalace="selectedEskalace"
                        v-bind="{ statusIoEnum, operationEskalaceCreate, operationEskalaceZnovuotevreni, uzivatelSkupinaList }"
                        v-on="{ schvaleni, zamitnuti, doVyroby, uzavreni, kAnalyze, predajKeSchvaleni, kReseni, vraceniKAnalyze, otvoreniUzavrene }"
                        @save="saveEskalace"
                      />
                    </k-row>
                    <k-tabs v-model="eskalaceActiveTabName">
                      <k-tab-panel :label="t('komentare')" name="EskalaceKomentare">
                        <frame-komentare
                          v-bind="{ rows: selectedEskalace.komentare?.rows ?? [], references: tables.priloha.rows, entita, parentId: knr }"
                          v-on="{ addKomentar: addEskalaceKomentar, update: updateEskalaceKomentar, delete: deleteEskalaceKomentar }"
                        />
                      </k-tab-panel>
                      <k-tab-panel :label="t('history')" name="EskalaceLog">
                        <ChangeLogFrame :change-log="selectedEskalace.changeLog?.rows ?? []" />
                      </k-tab-panel>
                    </k-tabs>
                  </div>
                </k-col>
                <k-col :span="4" v-if="selectedEskalace?.priloha?.rows">
                  <div>{{ t('Prilohy') }}</div>
                  <frame-prilohy
                    v-model="selectedEskalace.priloha.rows"
                    v-bind="{
                      entita: NAME_ESKALACE,
                      parentId: selectedEskalace.id,
                      beforeRemove: beforeRemovePriloha,
                      operationDeletePriloha: selectedEskalace.operationDeletePriloha,
                    }"
                  />
                </k-col>
              </k-row>
            </div>
          </k-tab-panel>
          <k-tab-panel :label="t('prInfo')" name="PrInfo">
            <pr-cislo-frame
              name="PrCislo"
              :rows="tables.prCislo.rows"
              :knr="knr"
              v-model:columns="tables.prCislo.columns"
              v-model:paging="tables.prCislo.paging"
              v-model:filter="tables.prCislo.filter"
              v-on="{ filterClick, loadRows }"
            />
          </k-tab-panel>
          <k-tab-panel :label="t('CasOpravy')" name="CasOpravy">
            <CasOpravy v-bind="{ casOpravy: tables.casOpravy, knr, showSummary: true }" @refresh="refreshCasOpravy" />
          </k-tab-panel>
        </k-tabs>
      </div>
    </k-card>
    <create-eskalace-dialog
      v-if="knr"
      v-model:visible="createEskalaceDialog.visible"
      v-model:eskalace="selectedEskalace"
      v-model:eskalaceEditDatum="eskalaceEditDatum"
      v-bind="{
        vozidloId: knr!,
        references: tables.priloha.rows,
        type: createEskalaceDialog.type,
        uzivatelSkupinaList,
      }"
      @closed="dialogClosed"
    />
  </k-layout-edit>
</template>

<script lang="ts">
  import { checkButton } from '@/template/components/table/tableOperations';
  import { showAlert } from '@/template/mixins/notifications';
  import { Entity } from '@/template/page/@types/page';
  import { editName } from '@/template/page/constants';
  import { init } from '@/template/page/providers/edit';
  import { PageMode } from '@/template/page/providers/pageMode';
  import { mapValues } from '@/template/page/providers/store_v2';
  import { openPage } from '@/template/router/path';
  import { createName } from '@/template/router/constants';
  import { useStore as usePageManagerStore } from '@/template/store/pageManager';
  import TableChyby from '@/views/chyby/components/TableChyby.vue';
  import PrCisloFrame from '@/views/ciselniky/prCislo/components/Frame.vue';
  import EskalaceFrame from '@/views/eskalace/components/Frame.vue';
  import FrameKomentare from '@/views/komentar/components/Frame.vue';
  import { apiProvider as vozidloStitekApiProvider } from '@/views/vozidloStitek/api/vozidloVozidloStitek';
  import { Check as CheckIcon, Expand as ExpandIcon } from '@element-plus/icons-vue';
  import _ from 'lodash';
  import { computed, defineComponent, onMounted, onBeforeUnmount, ref, toRefs, type ComputedRef } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { EnumStatusIo } from '../chyby/constants';
  import EskalaceDialog from '../eskalace/components/Dialog.vue';
  import ChangeLogFrame from '../eskalace/components/ChangeLogFrame.vue';
  import { EnumEskalaceDialogType, NAME as NAME_ESKALACE } from '../eskalace/constants';
  import { useEskalace } from '../eskalace/provider';
  import FramePrilohy from '../prilohy/components/Frame.vue';
  import type { FileItem } from '../prilohy/type';
  import KActions from './components/KActions.vue';
  import Semafor from './components/Semafor.vue';
  import VozidloTable from './components/VozidloTable.vue';
  import { NAME, NAME_CAS_OPRAVY, prilohyUrl } from './constants';
  import { local, props as storeProps, server, tables, useStore } from './store/edit';
  import type { Vozidlo, NavrhovanaZavadaSelected } from './type';
  import { VozidloZavada } from './zavada';
  import { NAME as VOZIDLO_ZAVADA_NAME } from './zavada/constants';
  import KMainRightVue from './components/KMainRight.vue';
  import { useRouter } from 'vue-router';
  import hash from 'object-hash';
  import { useStore as useAuthStore } from '@/template/account/authorization/store';
  import type { Eskalace } from '../eskalace/type';
  import { useEskalaceKomentar, useVozidloKomentar } from '../komentar/provider';
  import CasOpravy from './components/CasOpravy.vue';

  export default defineComponent({
    name: editName(NAME),
    components: {
      Semafor,
      VozidloTable,
      FrameKomentare,
      TableChyby,
      PrCisloFrame,
      FramePrilohy,
      CreateEskalaceDialog: EskalaceDialog,
      EskalaceFrame,
      KActions,
      KMainRightVue,
      ChangeLogFrame,
      CasOpravy,
    },
    setup() {
      const router = useRouter();
      const store = useStore();
      const pageManagerStore = usePageManagerStore();
      const authStore = useAuthStore();

      const { t } = useI18n();
      const entita = NAME;

      const edit = init(NAME, store);
      const mapedLast = !store.last
        ? toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local })
        : {
            ...mapValues(store.entityDefault.serverData, store, 'serverData'),
            ...mapValues(store.entityDefault.localData, store, 'localData'),
            ...mapValues(store.entityDefault, store),
          };

      const actionPopup = ref(false);
      const eskalaceIndex = computed(() => mapedLast.currentEskalace.value - 1);
      const selectedEskalace: ComputedRef<Eskalace> = computed(() => mapedLast.eskalace.value[eskalaceIndex.value]);

      const eskalaceProvider = useEskalace(selectedEskalace, mapedLast.uzivatelSkupinaList, mapedLast.createEskalaceDialog, () => {
        store.loadEskalace();
      });
      const komentareProvider = useVozidloKomentar(edit, mapedLast.knr);
      const eskalaceKomentareProvider = useEskalaceKomentar(store.loadEskalaceKomentar, selectedEskalace);
      const komentareCollapses = ref(['prilohy', 'komentare']);

      const aktualnyStatusBg = computed(() => (mapedLast.statusIoEnum.value === EnumStatusIo.opraveno ? 'success' : 'danger'));
      const neopravene = computed(() => mapedLast.statusIoEnum.value === EnumStatusIo.neopraveno);
      function openTestyUps() {
        // not yet implemented
      }
      const navrhovanaZavadaUse = () => {
        // not yet implemented
      };

      const extraButtons = [checkButton(navrhovanaZavadaUse)];
      function createEskalaci() {
        mapedLast.createEskalaceDialog.value.visible = true;
        mapedLast.createEskalaceDialog.value.type = EnumEskalaceDialogType.Vytvoreni;
      }

      const eskalaceActiveTabName = ref('EskalaceKomentare');

      const vozidlo = computed<Vozidlo>(() => mapedLast.serverData.value as Vozidlo);

      const createZavadu = () => {
        openPage(createName(VozidloZavada.name), PageMode.CREATE, { vozidloId: edit.entityId.value });
      };

      onMounted(() => {
        if (router.currentRoute.value.params.anchor === 'eskalace') {
          mapedLast.activeTabName.value = 'Eskalace';
        }
        if (pageManagerStore.previous?.name.includes('Linka')) {
          mapedLast.activeTabName.value = 'Testy';
        } else if (pageManagerStore.previous?.name.includes('eskalace') || pageManagerStore.previous?.name.includes('vraceniBaterie')) {
          mapedLast.activeTabName.value = 'Eskalace';
        }
      });

      async function beforeRemovePriloha(uploadFile: FileItem): Promise<boolean> {
        const used = mapedLast.tables.value.komentar.rows.some((k) => k.text.includes(uploadFile.name));
        if (used) {
          try {
            const result = await showAlert({
              message: `${t('existujeLinkVKomentary')} ${uploadFile.name}`,
              options: {
                closeOnClickModal: false,
                closeOnPressEscape: false,
                closeOnHashChange: false,
                showCancelButton: true,
                showConfirmButton: true,
                cancelButtonText: t('ne'),
                confirmButtonText: t('ano'),
              },
            });
            return result.action === 'confirm';
          } catch (_) {
            return false;
          }
        }

        return true;
      }

      async function dialogClosed() {
        mapedLast.activeTabName.value = 'Eskalace';
        await store.loadEskalace();
        if (mapedLast.localData.value.createEskalaceDialog.type === EnumEskalaceDialogType.Vytvoreni)
          mapedLast.currentEskalace.value = mapedLast.eskalace.value.length;
      }

      const prilohyUrlCmp = computed(() => {
        return `${prilohyUrl}${mapedLast.knr.value}`;
      });

      function updateStitky(stitkyIds: number[]) {
        vozidloStitekApiProvider.postList(parseInt(edit.entityId.value), stitkyIds);
      }

      async function updateZavadaNV(value: boolean) {
        vozidlo.value.zavadaVN = value;
        await edit.save(edit.entityId.value);
        await store.loadVozidloEntity({ id: edit.entityId.value });
      }

      async function updateBaterieVyjmuta() {
        vozidlo.value.baterieVyjmuta = !vozidlo.value.baterieVyjmuta;
        await edit.save(edit.entityId.value);
        await store.loadVozidloEntity({ id: edit.entityId.value });
      }

      function openPuvodniSqs() {
        const url = `https://sqs-prohlizecky.skoda.vwgroup.com/ordssqsm/sqsr/FePlayground_kd?i_knr13=${mapedLast.knr.value}`;
        window.open(url, '_blank');
      }

      function openPuvodniUps() {
        if (authStore.isPanel) {
          router.push({ name: 'PuvodniUps', params: { knr: mapedLast.knr.value } });
        } else {
          const url = `https://sqs-prohlizecky.skoda.vwgroup.com/ordssqsm/sqsr/ups_viewer.show_results?p_ident=${mapedLast.knr.value}`;
          window.open(url, '_blank');
        }
      }

      function openCarRfid() {
        const linka = mapedLast?.linka.value?.startsWith('KV') ? 'm3' : mapedLast?.linka.value?.endsWith('M1') ? 'm1' : 'm13';
        const url = `https://eportal.skoda.vwg/carrfid-${linka}/users?searchKNR=${mapedLast.knr.value}`;
        window.open(url, '_blank');
      }

      function saveEskalace() {
        const sameData = mapedLast.hash.value === hash(mapedLast.localData.value.eskalace);
        if (_.isNil(mapedLast.knr.value) || sameData) {
          return;
        }

        eskalaceProvider.save(true);
      }

      function refreshVozidloZavadaTable() {
        edit.fetchTableData({ filter: mapedLast.serverData.value, tablesToFetch: ['zavada'] });
      }

      async function openVozidloZavada(filter: Record<string, unknown>) {
        // TODO add loading
        mapedLast.navrhovanaZavadaSelected.value = {
          rowNumber: filter.rowNumber,
          sqsZavadaSkupinaId: filter.sqsZavadaSkupinaId,
          definiceZavadyId: filter.definiceZavadyId,
          sqsZavadaTypId: filter.sqsZavadaTypId,
          sqsZavadaVinikId: filter.sqsZavadaVinikId,
          sqsZavadaRadekId: filter.sqsZavadaRadekId,
        } as NavrhovanaZavadaSelected;
        await openPage(createName(VOZIDLO_ZAVADA_NAME), PageMode.CREATE, { vozidloId: mapedLast.knr.value });
      }

      async function openElsa() {
        await navigator.clipboard.writeText(mapedLast.vin.value ?? '');
        window.open('https://grp.volkswagenag.com/elsapro/elsaweb/ctr/DP/startElsa', '_blank');
      }

      async function refreshCasOpravy() {
        edit.loadTables({ knr: mapedLast.knr.value }, [NAME_CAS_OPRAVY]);
      }

      return {
        ...mapedLast,
        ...edit,
        ...eskalaceProvider,
        aktualnyStatusBg,
        openTestyUps,
        extraButtons,
        createEskalaci,
        createZavadu,
        vozidlo,
        ...komentareProvider,
        ...eskalaceKomentareProvider,
        t,
        entita,
        komentareCollapses,
        beforeRemovePriloha,
        dialogClosed,
        prilohyUrlCmp,
        CheckIcon,
        ExpandIcon,
        updateStitky,
        actionPopup,
        saveEskalace,
        openPuvodniSqs,
        openPuvodniUps,
        openCarRfid,
        refreshVozidloZavadaTable,
        openVozidloZavada,
        neopravene,
        selectedEskalace,
        NAME_ESKALACE,
        eskalaceActiveTabName,
        updateZavadaNV,
        updateBaterieVyjmuta,
        openElsa,
        refreshCasOpravy,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .big_buttons {
    margin-left: 0px;
    width: 33%;
  }

  .table_header {
    background-color: green;
  }

  .badge-action {
    margin-top: 10px;
    margin-right: 20px;
  }

  .koment-view {
    text-align: start;
    border: 1px solid lightgray;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
  }
</style>
