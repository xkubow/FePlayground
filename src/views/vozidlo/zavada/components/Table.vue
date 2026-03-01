<template>
	<k-table v-bind="{ columns, objectName: 'VozidloZavada', tableName, rowKey, maxHeight: 300, showSummary, summaryMethod }" v-on="{ rowDelete }">
		<template #opravenoDatum="{ column }">
			<zavada-status-column v-bind="{ column, tableName }" />
		</template>
	</k-table>
</template>

<script setup lang="ts">
import { h, type VNode } from 'vue';
import { apiProvider } from '../api';
import { columns, table as zavadaTable, type RowZavada } from '../tables/table';
import ZavadaStatusColumn from './StatusColumn.vue';
import type { TableColumnCtx } from 'element-plus';
import { useI18n } from 'vue-i18n';

interface SummaryMethodProps<T = RowZavada> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

export interface Props {
	tableName?: string;
	rowKey?: string;
	showSummary?: boolean
}

const { t } = useI18n();

const emit = defineEmits(['refresh']);

withDefaults(defineProps<Props>(), { tableName: zavadaTable.name, rowKey: zavadaTable.rowKey ?? undefined });

async function rowDelete(row: RowZavada) {
	await apiProvider.deleteEntity(row.id);
	emit('refresh');
}

const summaryMethod = (param: SummaryMethodProps) => {
  const { columns, data } = param
  const sums: (string | VNode)[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = h('div', {  }, [
        t('Summary'),
      ])
      return
    }
    const values = data.map((item) => Number(item.dobaOpravyMinuty))
    if (column.property === 'dobaOpravyMinuty') {
      sums[index] = `${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)}`
    } else {
      sums[index] = ''
    }
  })

  return sums
}
</script>

<style scoped></style>
