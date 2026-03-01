<template>
  <div v-if="hasRows" class="detail-wrap">
    <table class="detail-table">
      <tbody>
        <tr v-for="(d, i) in parsedRows" :key="d.rowNumber ?? i" class="detail-row">
          <td v-if="selectable" :class="[rowClass(d), 'col-select']">
            <div class="pl-10 d-f ai-c">
              <el-checkbox :model-value="!!d.selected" @change="(val: any) => toggleOne(d, !!val)" @click.stop />

              <span v-if="d.detail?.length" class="ml-10 cursor-p" @click.stop="openZavady(d.detail)"
                title="Open Zavady">
                <el-icon style="margin-left: 7px">
                  <ConnectionIcon />
                </el-icon>
              </span>
            </div>
          </td>

          <td class="col-pracovisteVyskytuZavady">
            <div v-for="(vyskyt, i) in d.pracovisteVyskytuZavady" :key="i"
              :class="[vyskytClass(vyskyt.testIo, d.detail?.length > 0), 'vyskyt', 'p-5']">
              {{ vyskyt.text }}
            </div>
          </td>

          <td class="col-statText">
            {{ d.statText }}
          </td>
          <td class="col-errorcodeLocation">
            {{ d.errorcodeLocation }}
          </td>
          <td class="col-errorcodeNr">
            <div class="d-f ai-c">
              {{ formatErrorCode(d.errorcodeNr) }}
              <el-icon v-if="d.errorcodeNr" class="ml-10 cursor-p" :size="15"
                @click="bugDetailClicked($event, parentRow, d)"><link-icon /></el-icon>
            </div>
          </td>

          <td class="col-errortext">
            {{ d.errorcodeText }}
          </td>
          <td class="col-errorcodeTypeText">
            {{ d.errorcodeTypeText }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <p v-else>No data</p>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Connection as ConnectionIcon, Link as LinkIcon } from '@element-plus/icons-vue';
import type { Detail, RowChyby } from '../type';

export type PracovisteItem = { text: string; isErr: boolean };

const props = defineProps<{
  diagnostickaAdresa: number;
  rows: Detail[];
  parentRow: RowChyby;

  selectable?: boolean;

  vyskytClass?: (hasDetail: boolean, isErr: boolean) => string;

  // callbacks
  openZavady: (ids: any[]) => void;
  onBugClick?: (event: Event, diagnostickaAdresa: number, errorcodeNr: number) => void;

  // optional i18n function
  t?: (key: string) => string;
}>();

const emits = defineEmits(['toggle-one']);

const selectable = computed(() => !!props.selectable);

const hasRows = computed(() => props.rows?.length > 0);

const parsedRows = computed(() => props.rows ?? []);

const allSelected = computed(() => {
  if (!selectable.value) return false;
  return parsedRows.value.length > 0 && parsedRows.value.every(r => !!r.selected);
});

const someSelected = computed(() => {
  if (!selectable.value) return false;
  const any = parsedRows.value.some(r => !!r.selected);
  return any && !allSelected.value;
});

function toggleOne(row: Detail, checked: boolean) {
  emits('toggle-one', props.parentRow, row, checked);
}

function rowClass(detail: Detail): string {
  if (detail.detail?.length) {
    return detail.opraveno ? 'background_greyed_opravene' : 'background_greyed_nok';
  }
  return detail.opraveno ? 'background_test_opravene' : 'background_test_nok';
}
function vyskytClass(isOk: boolean, hasDetail: boolean): string {
  if (hasDetail)
    return 'background_greyed_' + (isOk ? 'ok' : 'nok');
  else
    return 'background_test_' + (isOk ? 'opravene' : 'nok');
}
function formatErrorCode(val?: number | null): string {
  if (val == null) return '';
  return '0x' + val.toString(16).toUpperCase(); // same logic as original
}
function bugDetailClicked(event: Event, masterRow: RowChyby, detailRow: Detail) {
  event.stopPropagation();
  const jiraUrl = import.meta.env.VITE_APP_JIRA_VWGROUP as string;
  if (!jiraUrl)
    return;

  const url = new URL(jiraUrl);
  const errorcodeNumber = '0x' + detailRow.errorcodeNr.toString(16);
  const jqlQuery = `summary ~ "${errorcodeNumber}" OR description ~ "${errorcodeNumber}" ORDER BY lastViewed DESC`;
  url.searchParams.set('jql', jqlQuery);

  const diagnostickaAdresa = ('0000' + masterRow.diagnostickaAdresa.toString(16).toUpperCase()).substr(-4);
  url.searchParams.set('DA(s)', diagnostickaAdresa);
  url.searchParams.set('issuetype', 'DTC');

  window.open(url.toString(), '_blank');
}
</script>

<style scoped lang="scss">
.detail-table {
  width: 100%;
  border-collapse: collapse;
}

.detail-table thead {
  display: none;
}

.detail-wrap {
  padding: 8px 0;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
}

.detail-table th,
.detail-table td {
  padding: 0px 10px !important;
  border: 1px solid var(--el-border-color-lighter);
  vertical-align: middle;
}

.col-select {
  width: 60px;
  white-space: nowrap;
}

.col-pracovisteVyskytuZavady {
  padding: 6px 10px;
  width: 120px;
  white-space: nowrap;
}

.col-statText {
  padding: 6px 10px;
  width: 35%;
  white-space: nowrap;
}

.col-errorcodeLocation {
  padding: 6px 10px;
  width: 100px;
  white-space: nowrap;
}

.col-errorcodeNr {
  padding: 6px 10px;
  width: 100px;
  white-space: nowrap;
}

.col-errortext {
  padding: 6px 10px;
  white-space: nowrap;
}

.col-errorcodeTypeText

/* New column for errorcodeTypeText */
  {
  padding: 6px 10px;
  width: 100px;
  white-space: nowrap;
}

.col-pracoviste {
  width: auto;
}

.background_test_ok {
  background-color: green;
}

.background_test_nok {
  background-color: var(--clr-test-neopraveno);
}

.background_test_opravene {
  background-color: var(--clr-test-opraveno);
}

.background_test_ok_greyed {
  background-color: green;
}

.background_greyed_nok {
  background-color: var(--clr-grayed-neopraveno);
}

.background_greyed_opravene {
  background-color: var(--clr-grayed-opraveno);
}

.vyskyt {
  border-radius: 5px;
  border: 0.5px solid white;
}
</style>
