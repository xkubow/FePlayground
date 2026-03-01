<template>
  casOpravy.rowKey:{{ casOpravy?.rowKey }}
    <k-table-frame v-if="casOpravy" label-key="casOpravy">
        <template #header>  
            <span class="pr-10">{{ t(casOpravy.name) }}</span>
            <k-button :size="SMALL" @click="() => $emit('addCasOpravy')">
                <k-icon :size="10">
                    <PlusIcon />
                </k-icon>
            </k-button>
        </template>
        <k-table
            :rowKey="casOpravy.rowKey"
            :columns="casOpravy.columns"
            :rows="casOpravy.rows"
            :tableName="casOpravy.name"
            :extraButtons="extraButtons"
            :showSummary="showSummary"
            @summaryMethod="summaryMethod"
            v-on="{ rowDelete }"></k-table>
    </k-table-frame>
</template>

<script setup lang="ts">
import type { Table } from '@/template/components/table';
import { useI18n } from 'vue-i18n';
import { Plus as PlusIcon } from '@element-plus/icons-vue';
import { SMALL } from '@/template/constants';
import { apiProviderCasOpravy } from '../api';
import type { CasOpravy } from '../tables/casOpravy';
import { deleteButton, editButton } from '@/template/components/table/tableOperations';
import type { Row } from '@/template/components/table/@types/table';
import { h, toRefs, type VNode } from 'vue';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { TableColumnCtx } from 'element-plus'

interface SummaryMethodProps<T = CasOpravy> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

export interface Props {
    casOpravy?: Table | null;
    showSummary: boolean;
}

const { t } = useI18n();
const props = defineProps<Props>();
const propsRef = toRefs(props);

const emit = defineEmits(['addCasOpravy','editCasOpravy', 'refresh']);

async function rowDelete(e: Event, row: Row<CasOpravy>) {
    e.stopPropagation();
    await apiProviderCasOpravy.deleteEntity(row.id.toString());
    emit('refresh');
} 

function editRowClick(e: Event, row: Row<CasOpravy>) {
    e.stopPropagation();
    emit('editCasOpravy', row);
}

const extraButtons = [
    { ...editButton(editRowClick), isVisible: () => propsRef.casOpravy.value?.operations && OperationFlags.EDIT },
    { ...deleteButton(rowDelete), isVisible: () => propsRef.casOpravy.value?.operations && OperationFlags.DELETE }
];

const summaryMethod = ({ columns, data }: SummaryMethodProps): (string | VNode)[] => {
  const sums: (string | VNode)[] = [];

  const totalMinutes = data.reduce((acc, row: any) => {
    const value = Number(row.dobaOpravyMinuty);
    return Number.isNaN(value) ? acc : acc + value;
  }, 0);

  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = h('div', {}, t('Summary'));
    } else if (column.property === 'dobaOpravyMinuty') {
      sums[index] = String(totalMinutes);
    } else {
      sums[index] = '';
    }
  });

  return sums;
};
</script>

<style scoped></style>