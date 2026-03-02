<template>
  <k-table-column>
    <template #default="{ row }">
      <k-row class="jc-sb ai-c">
        <k-col :span="10">
          <span v-if="!row.editSegment" class="pr-10">{{ row.vyrobniLinkaSegmentText }}</span>
          <k-input v-else v-bind="{ labelKey: 'nazev', wrapp: false }" size="small" v-model="row.vyrobniLinkaSegmentText" wrappClass="w-100" />
        </k-col>

        <k-col :span="14" v-if="row.vyrobniLinkaSegmentId && editable" class="d-f jc-fe">
          <el-icon v-if="!row.editSegment" class="cursor-p mr-10" :size="17" @click.stop="edit(row)"><edit-icon /></el-icon>
          <el-icon v-if="!row.editSegment" class="cursor-p" :size="17" @click.stop="remove(row)"><minus-icon /></el-icon>
          <el-icon v-if="row.editSegment" class="cursor-p mr-10" :size="17" @click.stop="save(row)"><finished-icon /></el-icon>
          <el-icon v-if="row.editSegment" class="cursor-p" :size="17" @click.stop="cancel(row)"><close-icon /></el-icon>
        </k-col>
      </k-row>
    </template>
  </k-table-column>
</template>

<script setup lang="ts">
  import type { Row } from '@/template/components/table/@types/table';
  import { Close as CloseIcon, Edit as EditIcon, Finished as FinishedIcon, Minus as MinusIcon } from '@element-plus/icons-vue';
  import type { RowKonfigurace } from '../../tables';
  import { apiProvider } from '../api';

  export interface Props {
    editable: boolean;
  }

  withDefaults(defineProps<Props>(), { editable: true });

  const emits = defineEmits(['loadRows']);

  function edit(row: Row<RowKonfigurace>) {
    row.editSegment = true;
  }
  function cancel(row: Row<RowKonfigurace>) {
    row.editSegment = false;
    emits('loadRows');
  }
  async function save(row: Row<RowKonfigurace>) {
    row.editSegment = false;
    const payload = {
      id: row.vyrobniLinkaSegmentId,
      text: row.vyrobniLinkaSegmentText,
      upsNazev: row.vyrobniLinkaSegmentUpsNazev,
    };
    await apiProvider.updateEntity(row.vyrobniLinkaSegmentId, payload);
    emits('loadRows');
  }
  async function remove(row: Row<RowKonfigurace>) {
    await apiProvider.deleteEntity(row.vyrobniLinkaSegmentId);
    emits('loadRows');
  }
</script>

<style scoped></style>
