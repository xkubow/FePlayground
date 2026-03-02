<template>
  <k-layout-list ref="listLayout" v-bind="{ operations: table?.operations, leaving }" v-on="layoutListyeners">
    <template #title> {{ t(MENU) }} </template>
    <template #content>
      <k-table-frame v-bind="{ paging: tableBinds.paging, totalCount: tableBinds.totalCount }" v-model.paging="tableBinds.paging" v-on="tableEvents">
        <k-table
          ref="mtable"
          v-bind="{ maxHeight, ...tableBinds }"
          v-on="{ ...tableEvents, rowAddTo }"
          v-model:columns="tableBinds.columns"
          v-model.paging="tableBinds.paging"
        />
      </k-table-frame>
    </template>
  </k-layout-list>
</template>

<script lang="ts">
  import { useStore as useCacheStore } from '@/template/cache';
  import type { Row } from '@/template/components/table/@types/table';
  import { Entity } from '@/template/page/@types/page';
  import { editName, listName } from '@/template/page/constants';
  import { init } from '@/template/page/providers/list';
  import { generateComputed } from '@/template/page/providers/store';
  import { useStore as usePageManagerStore } from '@/template/store/pageManager';
  import { isNotNull } from '@/template/utils/typeCheck';
  import { apiProvider as vozidloStitekProvider } from '@/views/vozidloStitek/api/vozidloStitekPrCislo';
  import { NAME as VOZIDLO_STITEK_NAME } from '@/views/vozidloStitek/constants';
  import { storeToRefs } from 'pinia';
  import { defineComponent, toRefs } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { MENU, NAME } from './constants';
  import { local, props as storeProps, server, tables, useStore } from './store/list';
  import type { PrCislo } from './types';

  export default defineComponent({
    name: listName(NAME),
    setup(props) {
      const pageMgrStore = usePageManagerStore();
      const store = useStore();
      const cacheStore = useCacheStore();
      const { t } = useI18n();

      const cache = storeToRefs(cacheStore);
      const list = init(NAME, store, props);
      const mapedLast = store.last ? generateComputed(store.last) : toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local });

      async function rowAddTo(row: Row<PrCislo>) {
        const previousPage = pageMgrStore.previous;
        switch (previousPage?.name) {
          case editName(VOZIDLO_STITEK_NAME):
            isNotNull(mapedLast.props.value.vozidloStitekId);
            await vozidloStitekProvider.createEntity({ id2: row.prCisloKod, id1: mapedLast.props.value.vozidloStitekId });
            list.loadRows();
            break;
        }
      }

      return {
        ...list,
        ...mapedLast,
        ...cache,
        MENU,
        t,
        rowAddTo,
      };
    },
  });
</script>

<style scoped></style>
