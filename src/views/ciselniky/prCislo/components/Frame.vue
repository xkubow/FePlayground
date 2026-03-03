<script lang="ts">
  export default {
    name: 'pr-cislo-frame',
    inheritAttrs: false,
  };
</script>
<script setup lang="ts">
  import type { Column, Paging, Row } from '@/template/components/table/@types/table';
  import { useFilterAside } from '@/template/layouts/list/filterAside';
  import FilterAside from '@/template/layouts/list/FilterAside.vue';
  import { computed, toRefs, watch, type WritableComputedRef } from 'vue';
  import type { Filter } from '../tables';
  import type { PrCislo } from '../types';

  export interface Props {
    name: string;
    columns: Column[];
    paging: Paging | null;
    totalCount?: number;
    filter?: Filter;
    knr: number | null;
    rows: Row<PrCislo>[];
  }

  const props = defineProps<Props>();
  const propsRef = toRefs(props);
  const emits = defineEmits(['update:paging', 'update:columns', 'update:filter', 'filterClick', 'load-rows']);

  const { showFilter } = useFilterAside();

  watch(showFilter, () => {
    // table.value?.refreshLayout();
  });

  const columnsModel = computed({
    get(): Column[] | undefined | null {
      return propsRef.columns?.value;
    },
    set(val: Column[] | undefined | null) {
      emits('update:columns', val);
    },
  });

  const pagingModel = computed({
    get(): Paging | undefined | null {
      return propsRef.paging?.value;
    },
    set(val: Paging | undefined | null) {
      emits('update:paging', val);
    },
  });

  const filterModel: WritableComputedRef<Filter | undefined> = computed({
    get() {
      return propsRef.filter?.value;
    },
    set(val) {
      emits('update:filter', val);
    },
  });

  function filterResetClick() {
    if (!filterModel.value) return;
    filterModel.value.prCisloKod = null;
    filterModel.value.prCisloText = null;
    filterModel.value.prRodinaKod = null;
    filterModel.value.prRodinaText = null;
  }
</script>

<template>
  <k-table-frame v-bind="{ paging: paging, totalCount: totalCount, filterEnabled: true }" v-model:paging="pagingModel" v-model:showFilter="showFilter">
    <template #aside>
      <filter-aside
        v-if="filterModel"
        v-model:showFilter="showFilter"
        @filterClick="$emit('filterClick', { tableName: name, filter: { ...filter, knr } })"
        @filterResetClick="filterResetClick"
      >
        <k-input v-model="filterModel.prCisloKod" v-bind="{ labelKey: 'prCisloKod', wrapp: false }" />
        <k-input v-model="filterModel.prCisloText" v-bind="{ labelKey: 'prCisloText', wrapp: false }" />
        <k-input v-model="filterModel.prRodinaKod" v-bind="{ labelKey: 'prRodinaKod', wrapp: false }" />
        <k-input v-model="filterModel.prRodinaText" v-bind="{ labelKey: 'prRodinaText', wrapp: false }" />
      </filter-aside>
    </template>
    <k-table
      ref="table"
      rowKey="id"
      v-bind="{ maxHeight: 720, tableName: name }"
      :rows="rows"
      v-model:columns="columnsModel"
      v-model:paging="pagingModel"
      @loadRows="$emit('load-rows', { tableName: name, filter: { ...filterModel, knr } })"
    />
  </k-table-frame>
</template>

<style scoped></style>
