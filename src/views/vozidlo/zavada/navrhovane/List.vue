<template>
  <k-layout-list ref="listLayout" v-bind="{ operations: table?.operations, leaving }" v-on="layoutListyeners">
    <template #title> {{ t(MENU) }} </template>
    <template #filter>
      <k-date-interval v-model="vstupDatum" label-key="vstupDatum" v-bind="{ type: 'datetime' }" />
      <k-select label-key="modelovaTrida" v-model="modelovaTridaKod" multiple filterable default-first-option :options="dropDownList.modelovaTrida">
        <k-option
          v-for="item in dropDownList.modelovaTrida"
          :key="item.value"
          :label="`${item.value} - ${item.text}`"
          :value="item.value"
          :disabled="item.disabled"
        ></k-option>
      </k-select>
      <k-select label-key="modelovaSkupinaKod" v-model="modelovaSkupinaKod" multiple filterable default-first-option :options="dropDownList.modelovaSkupina">
        <k-option
          v-for="item in dropDownList.modelovaSkupina"
          :key="item.value"
          :label="`${item.value} - ${item.text}`"
          :value="item.value"
          :disabled="item.disabled"
        ></k-option>
      </k-select>
      <k-select label-key="vyrobniLinka" v-model="vyrobniLinkaId" :options="dropDownList.vyrobniLinka" @change="vyrobniLinkaChange" />
      <k-select label-key="segment" v-model="vyrobniLinkaSegmentId" :options="vyrobniLinkaSegmentList" />
    </template>
    <template #content>
      <k-table-frame v-bind="{ paging: tableBinds.paging, totalCount: tableBinds.totalCount }" v-model.paging="tableBinds.paging" v-on="tableEvents">
        <PrehledVue v-bind="{ maxHeight, rows: mappedRows }" v-model.paging="tableBinds.paging" />
      </k-table-frame>
    </template>
  </k-layout-list>
</template>

<script lang="ts">
  import { useStore as useCacheStore } from '@/template/cache';
  import PrehledVue from './components/Prehled.vue';
  import { Entity } from '@/template/page/@types/page';
  import { listName } from '@/template/page/constants';
  import { init } from '@/template/page/providers/list';
  import { generateComputed } from '@/template/page/providers/store';
  import { storeToRefs } from 'pinia';
  import { computed, defineComponent, onBeforeMount, toRefs, watch } from 'vue';
  import { NAME, MENU } from './constants';
  import { local, props as storeProps, server, tables, useStore } from './store/list';
  import type { NavrhovaneZavadyPrehled } from './tables/prehled';
  import { Table } from '@/template/components/table';
  import type { Row } from '@/template/components/table/@types/table';
  import { useI18n } from 'vue-i18n';
  import _ from 'lodash';

  export default defineComponent({
    name: listName(NAME),
    components: {
      PrehledVue,
    },
    setup(props) {
      const store = useStore();
      const cacheStore = useCacheStore();
      const { t } = useI18n();

      const cache = storeToRefs(cacheStore);
      const list = init(NAME, store, props, { loadRowsOnMounted: false });
      const mapedLast = store.last ? generateComputed(store.last) : toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local });

      const mappedRows = computed((): Row<NavrhovaneZavadyPrehled>[] => (list.table.value?.rows ?? []) as Row<NavrhovaneZavadyPrehled>[]);

      function vyrobniLinkaChange() {
        mapedLast.vyrobniLinkaSegmentId.value = null;
      }

      onBeforeMount(() => {
        if (!_.isNil(mapedLast.vyrobniLinkaId.value)) store.loadOnLinkaChange();
      });

      watch(mapedLast.vyrobniLinkaId, () => {
        store.loadOnLinkaChange();
      });

      return {
        ...list,
        ...mapedLast,
        ...cache,
        mappedRows,
        t,
        MENU,
        vyrobniLinkaChange,
      };
    },
  });
</script>

<style scoped></style>
@/template/components/table
