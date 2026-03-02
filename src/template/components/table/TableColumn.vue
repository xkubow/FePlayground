<template>
  <el-table-column
    :prop="column?.id"
    :label="labelText"
    :header-align="headerAlign"
    :align="column?.align"
    :width="column?.width"
    :show-overflow-tooltip="false"
    :sortable="false"
  >
    <template #header>
      <slot name="header" :scope="{ column, labelKey, nextSortIndex }">
        <k-table-column-header
          :column="column"
          :labelKey="`tables.${tableName}.${labelKey}`"
          :nextSortIndex="nextSortIndex"
          @update:column="$emit('update:column', $event)"
        />
      </slot>
    </template>
    <template #default="scope">
      <slot :row="scope.row" :column="column">
        <k-table-cell v-if="column && !column.columns" :row="scope.row" :columnId="column.id" :formatter="column.formatter" />
      </slot>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
  import { computed, toRefs, type PropType } from 'vue';
  import { baseProps, useBase } from '../base/base';
  import type { Column } from './@types/table';
  import KTableCell from './TableCell.vue';
  import KTableColumnHeader from './TableColumnHeader.vue';

  const emit = defineEmits(['update:column']);
  const props = defineProps({
    ...baseProps,
    column: { type: Object as Object as PropType<Column> },
    tableName: String,
    headerAlign: String,
    nextSortIndex: Number,
  });
  const propsRef = toRefs(props);
  const baseInit = useBase(propsRef);

  const hasHeaderSlot = computed(() => {
    // slots is available in <script setup>
    // @ts-ignore
    return !!slots?.header;
  });

  const width = computed(() => propsRef.column?.value?.width ?? undefined);
  const labelText = baseInit.labelText;
</script>

<style scoped></style>
