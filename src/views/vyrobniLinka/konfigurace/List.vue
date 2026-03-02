RowKOnfigurace
<template>
  <k-layout-list ref="listLayout" v-bind="{ operations: table?.operations, leaving, useCreate: false }" autoFilter v-on="layoutListyeners">
    <template #title>
      <span>{{ t('vyrobniLinkaKonfigurace') }}</span>
    </template>
    <template #header>
      <k-row>
        <k-select v-bind="{ options: vyrobniLinkaList, placeholder: t('vyrobniLinka', 2), span: 12, wrapp: false }" v-model="vyrobniLinkaId" class="mw-6" />
        <k-select
          v-bind="{ options: verzeFilter(vyrobniLinkaId!), labelKey: 'verze', disabled: !vyrobniLinkaId, span: 12, wrapp: false }"
          v-model="verze"
          class="mw-6"
        />
      </k-row>
    </template>
    <template #content>
      <k-table
        ref="mtable"
        v-bind="{ maxHeight: 1700, ...tableBinds, spanMethod, operations: 0 }"
        v-on="tableEvents"
        v-model:columns="tableBinds.columns"
        v-model.paging="tableBinds.paging"
      >
        <template #ibn="{ column }">
          <ibn-table-column
            v-bind="{ tableName: tableBinds.tableName, column, kontrolniBodList, editable: isVerzeEditabled }"
            v-on="{ loadRows, insert: () => (editIbnVisible = true), insertPracoviste }"
          />
        </template>
        <template #segment="{ column }">
          <segment-table-column
            v-bind="{ tableName: tableBinds.tableName, column, editable: isVerzeEditabled }"
            v-on="{ loadRows, insert: () => (editSegmentVisible = true) }"
          />
        </template>
        <template #pracoviste="{ column }">
          <pracoviste-table-column
            v-bind="{ tableName: tableBinds.tableName, column, editable: isVerzeEditabled, subEdit: isVerzeEditabledPracoviste }"
            v-on="{ loadRows }"
          />
        </template>
      </k-table>
      <segment-edit
        v-if="isVerzeSelected"
        v-model="editSegmentVisible"
        v-bind="{ verze: verze!, vyrobniLinkaId: vyrobniLinkaId!, segmentList: segmetAsRow, editable: isVerzeEditabled }"
        v-on="{ loadRows }"
      />
      <ibn-edit
        v-if="isVerzeSelected"
        v-model="editIbnVisible"
        v-bind="{ verze: verze!, vyrobniLinkaId: vyrobniLinkaId!, kontrolniBodList }"
        v-on="{ loadRows }"
      />
      <pracoviste-edit
        v-if="isVerzeSelected"
        v-model="editPracovisteVisible"
        v-bind="{
          verze: verze!,
          vyrobniLinkaId: vyrobniLinkaId!,
          vyrobniLinkaKontrolniBodId: selectedRow?.vyrobniLinkaKontrolniBodId!,
          vyrobniLinkaSegmentId: selectedRow?.vyrobniLinkaSegmentId!,
          kontrolniBodList,
          segmentList,
        }"
        v-on="{ loadRows }"
      />
    </template>
  </k-layout-list>
</template>

<script lang="ts">
  import type { UnknownObject } from '@/template/@types/kTemplate';
  import { useStore as useCacheStore } from '@/template/cache';
  import type { Row } from '@/template/components/table/@types/table';
  import type Table from '@/template/components/table/Table.vue';
  import { Entity } from '@/template/page/@types/page';
  import { listName } from '@/template/page/constants';
  import { init } from '@/template/page/providers/list';
  import { generateComputed } from '@/template/page/providers/store';
  import { OperationFlags } from '@/template/utils/operationFlags';
  import { Minus as MinusIcon, Plus as PlusIcon } from '@element-plus/icons-vue';
  import type { TableColumnCtx } from 'element-plus/lib/components/table/src/table-column/defaults';
  import _ from 'lodash';
  import { storeToRefs } from 'pinia';
  import { computed, defineComponent, ref, toRefs, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useVerze } from '../providers/verze';
  import { NAME } from './constants';
  import IbnEdit from './ibn/components/Edit.vue';
  import IbnTableColumn from './ibn/components/TableColumn.vue';
  import PracovisteEdit from './pracoviste/components/Edit.vue';
  import PracovisteTableColumn from './pracoviste/components/TableColumn.vue';
  import SegmentEdit from './segment/components/Edit.vue';
  import SegmentTableColumn from './segment/components/TableColumn.vue';
  import type { RowSegmenty } from './segment/table';
  import { local, props as storeProps, server, tables, useStore } from './store/list';
  import type { RowKonfigurace } from './tables';

  export default defineComponent({
    name: listName(NAME),
    components: {
      SegmentTableColumn,
      IbnTableColumn,
      PracovisteTableColumn,
      IbnEdit,
      SegmentEdit,
      PracovisteEdit,
    },
    setup(props) {
      const store = useStore();
      const cacheStore = useCacheStore();
      const { t } = useI18n();

      const cache = storeToRefs(cacheStore);
      const list = init(NAME, store, props, { loadRowsOnMounted: false });
      const mapedLast = store.last ? generateComputed(store.last) : toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local });
      const selectedRow = ref<RowKonfigurace | null>(null);

      const segmetAsRow = computed(
        () => (mapedLast.segmentList.value?.map((i) => ({ vyrobniLinkaSegmentText: i.text, vyrobniLinkaSegmentId: i.value })) ?? []) as Row<RowSegmenty>[],
      );

      watch(mapedLast.vyrobniLinkaId, () => {
        mapedLast.verze.value = null;
      });

      watch(mapedLast.verze, (verze) => {
        mapedLast.tables.value.table.rows = [];
        if (!_.isNil(verze)) list.loadRows();
      });

      //#region segmentace
      function spanCheck<T extends UnknownObject>(rows: Row<T>[], columnName: string, checkId: number | null) {
        let i = 0;
        while (rows[i] && rows[i][columnName] === checkId) {
          i++;
        }
        return i;
      }

      const spanPoradi2 = computed(() => {
        let ibnId = null as number | null;
        let ibnSpan = 0;
        let segmentId = null as number | null;
        let segmentSpan = 0;
        const spans = [];
        const rows = list.table.value?.rows as RowKonfigurace[];

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (row.vyrobniLinkaKontrolniBodId !== ibnId) {
            ibnId = row.vyrobniLinkaKontrolniBodId;
            ibnSpan = spanCheck(rows.slice(i), 'vyrobniLinkaKontrolniBodId', ibnId);
          } else ibnSpan = 0;
          if (row.vyrobniLinkaSegmentId !== segmentId) {
            segmentId = row.vyrobniLinkaSegmentId;
            segmentSpan = spanCheck(rows.slice(i), 'vyrobniLinkaSegmentId', segmentId);
          } else segmentSpan = 0;

          spans.push({ ibnSpan, segmentSpan });
        }
        return spans;
      });

      function spanMethod(payload: { row: RowKonfigurace; column: TableColumnCtx<RowKonfigurace>; rowIndex: number; columnIndex: number }) {
        let rowspan = 1;
        let colspan = 1;
        switch (payload.column.property) {
          case 'poradi':
          case 'ibnNazev':
          case 'repaseKontrolniBodIbnNazev':
          case 'zobrazitNaSemaforu':
            rowspan = spanPoradi2.value[payload.rowIndex].ibnSpan;
            break;
          case 'vyrobniLinkaSegmentText':
          case 'vyrobniLinkaSegmentUpsNazev':
            rowspan = spanPoradi2.value[payload.rowIndex].segmentSpan;
            break;
        }

        return { rowspan, colspan };
      }

      //#endregion

      const { verzeFilter } = useVerze(mapedLast.verzeList);
      const isVerzeSelected = computed(() => !_.isNil(mapedLast.verze.value) && !_.isNil(mapedLast.vyrobniLinkaId.value));
      const isVerzeEditabled = computed(() => {
        if (!((list.table.value?.operations ?? 0) & OperationFlags.EDIT)) return false;
        if (!isVerzeSelected.value) return false;
        const linka = mapedLast.vyrobniLinkaList.value.find((v) => v.id === mapedLast.vyrobniLinkaId.value);
        const verzeLinky = mapedLast.verzeList.value.filter((v) => v.vyrobniLinkaId === mapedLast.vyrobniLinkaId.value).sort((v) => v.verze) ?? [];
        return !_.isNil(linka?.aktivniVerze) ? linka!.aktivniVerze < (mapedLast.verze.value ?? 0) : mapedLast.verze.value === _.last(verzeLinky)?.verze;
      });
      const isVerzeEditabledPracoviste = computed(() => {
        if (!((list.table.value?.operations ?? 0) & OperationFlags.EDIT)) return false;
        if (!isVerzeSelected.value) return false;
        return true;
      });
      const editIbnVisible = ref(false);
      function insertIbnBod() {
        if (!isVerzeSelected.value) {
          return;
        }
        editIbnVisible.value = true;
      }
      const editSegmentVisible = ref(false);

      const editPracovisteVisible = ref(false);
      function insertPracoviste(row: RowKonfigurace) {
        if (!isVerzeSelected.value) {
          return;
        }
        selectedRow.value = row;
        editPracovisteVisible.value = true;
      }

      return {
        ...list,
        ...mapedLast,
        ...cache,
        spanMethod,
        PlusIcon,
        MinusIcon,
        verzeFilter,
        insertIbnBod,
        editIbnVisible,
        isVerzeSelected,
        editSegmentVisible,
        editPracovisteVisible,
        insertPracoviste,
        selectedRow,
        segmetAsRow,
        t,
        isVerzeEditabled,
        isVerzeEditabledPracoviste,
      };
    },
  });
</script>

<style scoped></style>
