<template>
  <div>
    <div v-for="row in props.changeLog" :key="row.rowNumber" style="margin-top: 16px">
      <div>
        <b>{{ row.text }}</b>
      </div>
      <table style="margin-left: 40px">
        <tr v-for="(column, index) in row.columns" :key="index">
          <td style="min-width: 100px">
            <div>{{ column.name }}:</div>
          </td>
          <td style="min-width: 100px">
            <div v-if="column.name === 'Popis'">
              <span v-html="column.oldValue" />
            </div>
            <div v-else>{{ column.oldValue }}</div>
          </td>
          <td style="padding: 0px 10px">
            <div>
              <el-icon><Right /></el-icon>
            </div>
          </td>
          <td style="min-width: 100px">
            <div v-if="column.name === 'Popis'">
              <span v-html="column.newValue" />
            </div>
            <div v-else>{{ column.newValue }}</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ChangeLogRow } from '../tables/changeLogTable.js';
  import { Right } from '@element-plus/icons-vue';

  export interface Props {
    changeLog: ChangeLogRow[];
  }

  const props = defineProps<Props>();
</script>

<style scoped></style>
