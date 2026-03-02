<template>
  <k-table
    ref="mainTable"
    :tableName="table.name"
    :rows="rows"
    :columns="columns"
    :rowKey="table.rowKey"
    @row-click="rowClick"
    :expand-row-keys="expandRowKeys"
  >
    <template #detail="{ column }">
      <k-table-column :column="column" type="expand" :tableName="table.name" :labelKey="column.i18nKey">
        <template #default="{ row }">
          <NavrhovaneZavadyDetailTable
            v-if="row?.detail?.length > 0"
            :rows="row.detail"
            :columns="columnsDetail"
            :selectable="selectable"
            :disabled="disabled"
            :rowClassName="rowClassName"
            @row-click="(detailRow) => detailRowClick(detailRow, row)"
          />
        </template>
      </k-table-column>
    </template>
  </k-table>
</template>

<script setup lang="ts">
  import { table } from '../tables/table';
  import { columnsDetail, type NavrhovaneZavady, type NavrhovaneZavadyDetail, columns } from '../tables/table';
  import { ref } from 'vue';
  import type { Row } from '@/template/components/table/@types/table';
  import NavrhovaneZavadyDetailTable from './NavrhovaneZavadyDetailTable.vue';

  export interface Props {
    disabled?: boolean;
    selectable?: boolean;
    rows: NavrhovaneZavady[];
  }

  defineProps<Props>();

  const emit = defineEmits(['detailRowClicked']);

  const expandRowKeys = ref<(string | number)[]>([]);

  function rowClick(row: NavrhovaneZavady) {
    if (!row.detail?.length) return;
    const key = row.definiceZavadyId;
    expandRowKeys.value = expandRowKeys.value[0] === key ? [] : [key];
  }

  async function detailRowClick(detailRow: NavrhovaneZavadyDetail, row: NavrhovaneZavady) {
    emit('detailRowClicked', {
      isFromNavrhovane: true,
      rowNumber: detailRow.rowNumber,
      sqsZavadaSkupinaId: row.sqsZavadaSkupinaId,
      definiceZavadyId: row.definiceZavadyId,
      sqsZavadaTypId: detailRow.sqsZavadaTypId,
      sqsZavadaVinikId: detailRow.sqsZavadaVinikId,
      sqsZavadaRadekId: row.sqsZavadaRadekId,
    });
  }

  function rowClassName({ row }: { row: Row<NavrhovaneZavadyDetail>; rowIndex: number }) {
    return row.selected ? 'row-selected' : '';
  }
</script>

<style scoped></style>
