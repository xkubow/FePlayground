<template>
  <k-layout-list ref="listLayout" v-bind="{ operations: table?.operations, mainHeaderHeight: '500', loadingContent, leaving }" v-on="layoutListyeners">
    <template #title> {{ t(MENU) }} </template>
    <template #header>
      <k-select label-key="vyrobniLinka" v-model="vyrobniLinkaId" :options="dropDownList.vyrobniLinka" :wrapp="false" @change="linkaChange" :span="6" />
      <k-select label-key="segment" v-model="vyrobniLinkaSegmentId" :options="vyrobniLinkaSegmentList" :wrapp="false" @change="segmentChange" :span="6" />
      <k-select
        label-key="kontrolniBod"
        v-model="vyrobniLinkaKontrolniBodId"
        multiple
        collapse-tags
        collapse-tags-tooltip
        :options="vyrobniLinkaKontrolniBodList"
        :wrapp="false"
        @change="kontrolniBodyChange"
        :span="6"
      />
      <k-select
        label-key="modelovyKlic"
        :span="6"
        :wrapp="false"
        v-model="modelovyKlicKod"
        multiple
        filterable
        default-first-option
        @change="modelovyKlicChange"
      >
        <k-option
          v-for="item in dropDownList.modelovaTrida"
          :key="item.value"
          :label="`${item.value} - ${item.text}`"
          :value="item.value"
          :disabled="item.disabled"
        ></k-option>
      </k-select>
    </template>
    <template #content>
      <k-collapse v-if="!loadingContent" v-model="mainCollapse" style="width: 100%" :loading="true">
        <k-card v-for="kontrolniBodId in vyrobniLinkaKontrolniBodId" :key="kontrolniBodId" class="card">
          <k-collapse-item :name="`${kontrolniBodId}`" class="colapse">
            <template #title>
              <k-row class="ai-c">
                <k-col :span="2">
                  <h2 class="at-s ml-10">{{ getKontrolniBodText(kontrolniBodId) }}</h2>
                </k-col>
                <k-col :span="2">
                  <span class="at-s ml-10 fs-20">{{ mainHeaderText(kontrolniBodId) }} </span>
                </k-col>
                <k-col :span="20" class="at-s">
                  <span
                    v-for="header in getHeaderData(kontrolniBodId).models"
                    :key="header.label"
                    class="bordered p-5 at-s ml-10 fs-20"
                    :style="getPercentageColor(header.uspesnost)"
                  >
                    {{ `${header.label}: ${header.count} ${header.uspesnost}%` }}
                  </span>
                </k-col>
              </k-row>
            </template>
            <k-row>
              <voz-card v-for="voz in filteredRowsByKontrolniBod(kontrolniBodId)" :key="voz.knr" v-bind="{ voz, isEditMode }" />
            </k-row>
          </k-collapse-item>
        </k-card>
      </k-collapse>
    </template>
  </k-layout-list>
</template>

<script lang="ts">
  import { useStore as useCacheStore } from '@/template/cache';
  import { Entity } from '@/template/page/@types/page';
  import { listName } from '@/template/page/constants';
  import { init } from '@/template/page/providers/list';
  import { generateComputed } from '@/template/page/providers/store';
  import { roundTo } from '@/template/utils/math';
  import { OperationFlags } from '@/template/utils/operationFlags';
  import _ from 'lodash';
  import { storeToRefs } from 'pinia';
  import { computed, defineComponent, onBeforeUnmount, ref, toRefs } from 'vue';
  import { useI18n } from 'vue-i18n';
  // import KnrStautsColumn from './components/KnrStatusColumn.vue';
  import VozCard from './components/VozCard.vue';
  import { MENU, NAME } from './constants';
  import { local, props as storeProps, server, tables, useStore } from './store/list';
  import type { Blikacka } from './type';

  export default defineComponent({
    name: listName(NAME),
    components: { VozCard },
    setup(props) {
      const store = useStore();
      const cacheStore = useCacheStore();
      const { t } = useI18n();

      const cache = storeToRefs(cacheStore);
      const list = init(NAME, store, props, { loadRowsOnMounted: false, afterDataLoad });
      const mappedLast = store.last ? generateComputed(store.last) : toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local });
      const loadingContent = ref(false);

      function afterDataLoad() {
        loadLinkaData();
      }

      function getKontrolniBodText(kontrolniBodId: number) {
        return mappedLast.vyrobniLinkaKontrolniBodList.value.find((i) => i.value === kontrolniBodId)?.text ?? '';
      }

      function pocetUspesnost(cars: Blikacka[]): { count: number; uspesnost: number } {
        const count = cars.length;
        const carsOprava = cars.filter((c) => !c.oprava);

        const uspesnost = count === 0 ? 0 : roundTo((carsOprava.length / count) * 100, 2);
        return { count, uspesnost };
      }

      const headerData = computed(() => {
        return mappedLast.vyrobniLinkaKontrolniBodId.value.map((lId) => {
          const cars = list.table.value?.rows.filter((v) => v.kontrolniBodId === lId) as Blikacka[];
          const main = pocetUspesnost(cars);
          const models = _.values(_.groupBy(cars, 'model')).map((m) => ({ label: m[0].model, ...pocetUspesnost(m) }));
          return { id: lId, main, models: _.sortBy(models, 'label') };
        });
      });

      function mainHeaderText(lId: number): string {
        const header = headerData.value.find((h) => h.id === lId);
        return `${header?.main.count} ${header?.main.uspesnost}%`;
      }

      const getHeaderData = (lId: number) => headerData.value.find((h) => h.id === lId) ?? { models: [] };
      const filterBySegment = computed(() =>
        mappedLast.vyrobniLinkaSegmentId.value
          ? list.table.value?.rows.filter((r) => r.segmentId === mappedLast.vyrobniLinkaSegmentId.value)
          : list.table.value?.rows,
      );

      function filteredRows(kontrolniBodId: number) {
        const filter = (row: Blikacka) =>
          row.kontrolniBodId === kontrolniBodId &&
          (mappedLast.modelovyKlicKod.value?.length > 0 ? mappedLast.modelovyKlicKod.value.includes(row.modelovyKlicKod.substring(0, 2)) : true);

        const filtered = (filterBySegment.value as Blikacka[] | undefined)?.filter(filter);

        return filtered;
      }

      async function linkaChange() {
        if (mappedLast.vyrobniLinkaId.value) {
          mappedLast.vyrobniLinkaKontrolniBodId.value = [];
          mappedLast.vyrobniLinkaSegmentId.value = null;
          loadLinkaData();
        }
      }

      async function loadLinkaData() {
        if (mappedLast.vyrobniLinkaId.value) {
          loadingContent.value = true;
          await store.loadLinkaDropDowns(mappedLast.vyrobniLinkaId.value);
          mappedLast.mainCollapse.value = mappedLast.vyrobniLinkaKontrolniBodList.value.map((i) => `${i.value}`);
          await list.filterClick();
          loadingContent.value = false;
        }
      }

      function segmentChange() {
        list.saveFilterToLocalStore();
        //segmentChange
      }
      function kontrolniBodyChange() {
        list.saveFilterToLocalStore();
        // mapedLast.mainColapse.value = mapedLast.vyrobniLinkaKontrolniBodId.value.map((i) => i.toString());
      }

      function modelovyKlicChange() {
        list.saveFilterToLocalStore();
      }

      const timer = setInterval(() => list.loadRows(), 30000);

      onBeforeUnmount(() => {
        clearInterval(timer);
      });

      const isEditMode = computed(() => !!((list.table?.value?.operations ?? 0) & OperationFlags.EDIT));

      function getPercentageColor(percentage: number) {
        return percentage === 100 ? { background: '#9bd1a7' } : {};
      }

      return {
        ...list,
        ...mappedLast,
        ...cache,
        MENU,
        t,
        mainHeaderText,
        getKontrolniBodText,
        getHeaderData,
        filteredRowsByKontrolniBod: filteredRows,
        kontrolniBodyChange,
        linkaChange,
        segmentChange,
        isEditMode,
        modelovyKlicChange,
        loadingContent,
        getPercentageColor,
      };
    },
  });
</script>

<style lang="scss" scoped></style>
