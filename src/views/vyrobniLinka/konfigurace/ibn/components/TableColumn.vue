<template>
  <k-table-column v-bind="{ tableName, labelKey: column.i18nKey, column, prop: `${column.id}` }">
    <template #header>
      <k-table-column-header v-bind="{ column, labelKey: `tables.${tableName}.${column.i18nKey}` }">
        <template #actions>
          <k-icon v-if="editable" class="cursor-p mr-10" :size="17" @click.stop="$emit('insert')"><plus-icon /></k-icon>
        </template>
      </k-table-column-header>
    </template>
    <poradi-table-column v-bind="{ tableName, labelKey: column.columns![0].i18nKey, column: column.columns![0], prop: `${column.columns![0].id}` }" />
    <nazev-table-column
      v-bind="{
        tableName,
        labelKey: column.columns![1].i18nKey,
        column: column.columns![1],
        prop: `${column.columns![1].id}`,
        editable,
      }"
      @insertPracoviste="$emit('insertPracoviste', $event)"
      @loadRows="$emit('loadRows')"
    />
    <repase-table-column
      v-bind="{
        tableName,
        labelKey: column.columns![2].i18nKey,
        column: column.columns![2],
        prop: `${column.columns![2].id}`,
        kontrolniBodList,
      }"
    />
    <semafor-table-column
      v-bind="{
        tableName,
        labelKey: column.columns![3].i18nKey,
        column: column.columns![3],
        prop: `${column.columns![3].id}`,
      }"
    />
  </k-table-column>
</template>

<script setup lang="ts">
  import type { Column } from '@/template/components/table/@types/table';
  import type { DropdownItem } from '@/template/page/@types/mode';
  import { Plus as PlusIcon } from '@element-plus/icons-vue';
  import NazevTableColumn from './NazevTableColumn.vue';
  import PoradiTableColumn from './PoradiTableColumn.vue';
  import RepaseTableColumn from './RepaseTableColumn.vue';
  import SemaforTableColumn from './SemaforTableColumn.vue';

  export interface Props {
    tableName: string;
    column: Column;
    kontrolniBodList: DropdownItem[];
    editable: boolean;
  }

  defineProps<Props>();

  defineEmits(['insert', 'insertPracoviste', 'loadRows', 'update:edit']);
</script>

<style scoped></style>
