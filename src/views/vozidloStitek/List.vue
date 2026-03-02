<template>
  <k-layout-list ref="listLayout" v-bind="{ operations: table?.operations, leaving }" v-on="layoutListyeners">
    <template #title> {{ t(NAME) }} </template>
    <template #content>
      <k-table-frame v-bind="{ paging: tableBinds.paging, totalCount: tableBinds.totalCount }" v-model.paging="tableBinds.paging" v-on="tableEvents">
        <k-table
          ref="mtable"
          v-bind="{ maxHeight, ...tableBinds }"
          v-on="tableEvents"
          @row-delete="rowDelete"
          v-model:columns="tableBinds.columns"
          v-model.paging="tableBinds.paging"
        />
      </k-table-frame>
    </template>
  </k-layout-list>
</template>

<script lang="ts">
  import { useStore as useCacheStore } from '@/template/cache';
  import { Entity } from '@/template/page/@types/page';
  import { listName } from '@/template/page/constants';
  import { init } from '@/template/page/providers/list';
  import { generateComputed } from '@/template/page/providers/store';
  import { storeToRefs } from 'pinia';
  import { defineComponent, toRefs } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { NAME } from './constants';
  import { local, props as storeProps, server, tables, useStore } from './store/list';
  import type { VozidloStitek } from './type';
  import { apiProvider } from './api';

  export default defineComponent({
    name: listName(NAME),
    setup(props) {
      const store = useStore();
      const cacheStore = useCacheStore();
      const { t } = useI18n();

      const cache = storeToRefs(cacheStore);
      const list = init(NAME, store, props);
      const mapedLast = store.last ? generateComputed(store.last) : toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local });

      async function rowDelete(row: VozidloStitek) {
        await apiProvider.deleteEntity(row.id);
        list.loadRows();
      }

      return {
        ...list,
        ...mapedLast,
        ...cache,
        NAME,
        t,
        rowDelete,
      };
    },
  });
</script>

<style scoped></style>
