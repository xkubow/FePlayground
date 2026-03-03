<template>
  <k-table-frame v-bind="{ paging: tableBinds.paging, totalCount: tableBinds.totalCount }" v-model.paging="tableBinds.paging">
    <k-table
      ref="mainTable"
      v-bind="tableBinds"
      @selection-change="mainSelectionChange"
      @row-click="rowClick"
      :expand-row-keys="expandRowKeys"
      @expand-change="onExpandChange"
    >
      <template #ridiciJednotka="{ column }">
        <k-table-column v-bind="{ column, tableName: tableBinds.name, labelKey: column.i18nKey, filterable: false }" @update:column="columnUpdate">
          <template #default="{ row }">
            <div class="space-betwen">
              <ptb-info v-bind="{ rjInfo: rjInfo(row) }" />
              <k-table-cell v-bind="{ row: row, columnId: column.id, formatter: column.formatter }" />
            </div>
          </template>
        </k-table-column>
      </template>
      <template #pblText="{ column }">
        <k-table-column v-bind="{ column, tableName: tableBinds.name, labelKey: column.i18nKey, filterable: false }" @update:column="columnUpdate">
          <template #default="{ row }">
            <div class="d-f ai-c">
              <k-table-cell v-bind="{ row: row, columnId: column.id, formatter: column.formatter }" />
              <el-icon class="ml-10 cursor-p" :size="15" @click="bugClicked($event, row)"><link-icon /></el-icon>
            </div>
          </template>
        </k-table-column>
      </template>

      <template #detail="{ column }">
        <k-table-column v-bind="{ column, type: 'expand', tableName: tableBinds.name, labelKey: column.i18nKey, align: 'center' }">
          <template #default="{ row }">
            <div class="table-detail">
              <ChybyDetailTable
                v-if="isExpanded(row) && row.detail?.length"
                :diagnostickaAdresa="row.diagnostickaAdresa"
                :parentRow="row"
                :rows="row.detail"
                :selectable="tableBinds.selectable"
                :vyskytClass="vyskytClass"
                @toggleOne="toggleOneDetail"
                :openZavady="openZavady"
                :onBugClick="bugDetailClicked"
                :t="t"
              />

              <p v-else>No data</p>
            </div>
          </template>
        </k-table-column>
      </template>
    </k-table>
  </k-table-frame>
  <k-dialog v-model="visibleDialog" v-bind="{ title: t('zavadyNaChybe'), showCancel: false, showOk: false }">
    <k-table v-bind="{ ...zavady, tableName: zavady.name }" />
  </k-dialog>
</template>

<script lang="ts">
  export default {
    name: 'k-table-chyby',
  };
</script>

<script setup lang="ts">
  import type { Column, Row } from '@/template/components/table/@types/table';
  import { UpdateStatus } from '@/template/components/table';
  import { STORE_TABLE } from '@/template/page/constants';
  import { PageMode } from '@/template/page/providers/pageMode';
  import { openEdit } from '@/template/router/path';
  import { apiProvider as apiProviderZavada } from '@/views/vozidlo/zavada/api';
  import { NAME } from '@/views/vozidlo/zavada/constants';
  import { table as zavadyTable, type RowZavada } from '@/views/vozidlo/zavada/tables/table';
  import _ from 'lodash';
  import { computed, ref, toRefs } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { Row as RowRjInfo } from '../tables/ridiciJednotka';
  import { type Detail, type RowChyby, table as chybyTable } from '../tables/table';
  import type { Detail2 } from '../type';
  import PtbInfo from './PtbInfo.vue';
  import { Link as LinkIcon } from '@element-plus/icons-vue';
  import ChybyDetailTable from './TableDetailChyby.vue';

  export interface Props {
    columns: Column[];
    rows: RowChyby[];
    rjInfopRows?: Row<RowRjInfo>[];
  }
  const props = defineProps<Props>();
  const propsRef = toRefs(props);

  const emit = defineEmits(['detail-select']);

  const visibleDialog = ref(false);
  const { t } = useI18n();

  const expandRowKeys = ref<(string | number)[]>([]);

  function onExpandChange(changed: { row: Row<RowChyby>; expandedRows: Row<RowChyby>[] }) {
    const expandRow = !isExpanded(changed.row);
    if (expandRow) expandRowKeys.value.push(changed.row.rowNumber);
    else expandRowKeys.value = expandRowKeys.value.filter((rk) => rk !== changed.row.rowNumber);
  }

  const tableBinds = computed(() => ({
    ...chybyTable,
    columns: propsRef.columns.value,
    rows: propsRef.rows?.value ?? [],
    tableName: chybyTable.name,
    selectable: true,
    rowKey: 'rowNumber',
    cellClassName: testCellClass,
  }));

  function testCellClass({ row, column, rowIndex, columnIndex }: { row: Row<RowChyby>; column: string; rowIndex: number; columnIndex: number }) {
    if (columnIndex === 0) {
      if (row.detail.every((p) => p.detail.length > 0)) return row.opravenoVse ? 'background_greyed_opravene' : 'background_greyed_nok';
      return row.opravenoVse ? 'background_test_opravene' : 'background_test_nok';
    }
  }

  function rjInfo(row: Row<RowChyby>) {
    return propsRef.rjInfopRows?.value?.find((r) => r.ridiciJednotkaId === row.ridiciJednotkaId);
  }

  function setUpdateStatus(row: Row<Detail>, checked: boolean) {
    row.selected = checked;
    if (row.updateStatus) {
      row.updateStatus = undefined;
    } else {
      checked && emit('detail-select', row);
      row.updateStatus = checked ? UpdateStatus.INSERTED : UpdateStatus.DELETED;
    }
  }

  function mainSelectionChange({ checked, row }: { checked: boolean; row: Row<RowChyby> }) {
    row.detail.forEach((d) => {
      d.selected = checked;
      setUpdateStatus(d, checked);
    });
  }

  const zavady = ref(zavadyTable);

  async function openZavady(ids: Detail2[]) {
    if (ids.length > 1) {
      try {
        zavady.value.startLoading();
        const vozidloZavadaId = ids.map((i) => i.vozidloZavadaId) as number[];
        const response = await apiProviderZavada.tableData<{ rows: Row<RowZavada>[] }>({ filter: { vozidloZavadaId }, tableName: STORE_TABLE });
        zavady.value.rows = response?.data.rows ?? [];
        visibleDialog.value = true;
      } finally {
        zavady.value.endLoading();
      }
    } else openEdit(NAME, PageMode.EDIT, { id: ids[0].vozidloZavadaId });
  }

  // const route = useRoute();
  // watch(route, () => {
  // 	visibleDialog.value = false;
  // });

  function vyskytClass(hasDdetail: boolean, isErr: boolean) {
    let colorClass;
    if (hasDdetail) colorClass = isErr ? 'background_greyed_nok' : 'background_greyed_ok';
    else colorClass = isErr ? 'background_test_nok' : 'background_test_opravene';
    return `vyskyt pl-10 ${colorClass}`;
  }

  function rowClick(row: Row<RowChyby>) {
    if (!row.detail?.length) return;
    const key = row.rowNumber;
    expandRowKeys.value = expandRowKeys.value[0] === key ? [] : [key];
  }

  function bugClicked(event: Event, row: Row<RowChyby>) {
    event.stopPropagation();
    const jiraUrl = import.meta.env.VITE_APP_JIRA_VWGROUP as string;
    if (!jiraUrl) return;

    const url = new URL(jiraUrl);
    const jqlQuery = `summary ~ "${row.pblText}" OR description ~ "${row.pblText}" ORDER BY lastViewed DESC`;

    url.searchParams.set('jql', jqlQuery);
    const diagnostickaAdresa = ('0000' + row.diagnostickaAdresa.toString(16).toUpperCase()).substr(-4);
    url.searchParams.set('DA(s)', diagnostickaAdresa);
    url.searchParams.set('issuetype', 'Bug');

    window.open(url.toString(), '_blank');
  }

  function bugDetailClicked(event: Event, diagnostickaAdresa: number, errorcodeNr: number) {
    event.stopPropagation();
    const jiraUrl = import.meta.env.VITE_APP_JIRA_VWGROUP as string;
    if (!jiraUrl) return;

    const url = new URL(jiraUrl);
    const errorcodeNumber = '0x' + errorcodeNr.toString(16);
    const jqlQuery = `summary ~ "${errorcodeNumber}" OR description ~ "${errorcodeNumber}" ORDER BY lastViewed DESC`;
    url.searchParams.set('jql', jqlQuery);

    const diagnostickaAdresaStr = ('0000' + diagnostickaAdresa.toString(16).toUpperCase()).substr(-4);
    url.searchParams.set('DA(s)', diagnostickaAdresaStr);
    url.searchParams.set('issuetype', 'DTC');

    window.open(url.toString(), '_blank');
  }

  function rowKey(row: Row<RowChyby>) {
    return row.rowNumber; // replace with your unique key
  }

  function isExpanded(row: Row<RowChyby>) {
    return expandRowKeys.value.includes(rowKey(row));
  }

  function toggleOneDetail(parentRow: Row<RowChyby>, d: Row<Detail>, checked: boolean) {
    if (!!d.selected === checked) return;
    d.selected = checked;
    setUpdateStatus(d, checked);

    const all = parentRow.detail.every((x) => !!x.selected);
    const none = parentRow.detail.every((x) => !x.selected);
    parentRow.selected = all ? true : none ? false : null;
  }

  function columnUpdate(column: Column) {
    const colIndex = propsRef.columns.value.findIndex((c) => c.id === column.id);
    propsRef.columns.value[colIndex] = column;
  }
</script>

<style lang="scss" scoped>
  .space-betwen {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .vyskyt {
    border-radius: 5px;
    border: 0.5px solid white;
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
</style>
