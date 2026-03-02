<template>
  <k-layout-list ref="listLayout" v-bind="{ operations: table?.operations, leaving }" v-on="layoutListyeners">
    <template #title> {{ t(MENU) }} </template>
    <template #filter>
      <k-select label-key="modelovaSkupinaKod" v-model="modelovaSkupinaKod" :options="dropDownList.modelovaSkupinaKod" />
    </template>
    <template #content>
      <k-table-frame v-bind="{ paging: tableBinds.paging, totalCount: tableBinds.totalCount }" v-model.paging="tableBinds.paging" v-on="tableEvents">
        <k-table
          ref="mtable"
          v-bind="{ maxHeight, ...tableBinds }"
          v-on="{ ...tableEvents, rowDelete }"
          v-model:columns="tableBinds.columns"
          v-model.paging="tableBinds.paging"
        />
      </k-table-frame>
    </template>
  </k-layout-list>
</template>

<script lang="ts">
  import { Entity } from '@/template/page/@types/page';
  import { listName } from '@/template/page/constants';
  import { init } from '@/template/page/providers/list';
  import { generateComputed } from '@/template/page/providers/store';
  import { defineComponent, toRefs } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { MENU, NAME } from './constants';
  import { local, props as storeProps, server, tables, useStore } from './store/list';
  import type { ModelovaSkupina } from './type';
  import { apiProvider } from './api';

  export default defineComponent({
    name: listName(NAME),
    setup(props) {
      const store = useStore();
      const { t } = useI18n();

      const list = init(NAME, store, props);
      const mapedLast = store.last ? generateComputed(store.last) : toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local });

      async function rowDelete(row: ModelovaSkupina) {
        await apiProvider.deleteEntity(row.modelovaSkupinaKod);
        list.loadRows();
      }

      return {
        ...list,
        ...mapedLast,
        MENU,
        t,
        rowDelete,
      };
    },
  });
</script>

<style scoped></style>
