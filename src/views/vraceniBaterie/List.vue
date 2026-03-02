<template>
  <k-layout-list ref="listLayout" v-bind="{ operations: table?.operations, leaving }" v-on="layoutListyeners">
    <template #title> {{ t(NAME) }} </template>
    <template #filter>
      <k-select label-key="vyrobniLinka" v-model="vyrobniLinkaId" :options="dropDownList.vyrobniLinka" multiple />
      <k-select label-key="statusIo" v-model="vraceniBaterieStatusEnum" :options="vraceniBaterieStatusList" multiple />
      <k-select label-key="UzivateleSkupina" multiple v-model="prirazenaSkupinaUzivateluId" :options="prirazenaSkupinaUzivateluIdList" />
      <k-select
        :label="t('uzivatel', 2)"
        v-model="prirazenyUzivatelId"
        multiple
        filterable
        remote
        reserve-keyword
        options-value-name="id"
        options-text-name="zobrazeneJmeno"
        :remote-method="prirazenyUzivatelProvider.remoteFilter"
        :loading="prirazenyUzivatelProvider.remoteFilterLoading.value"
        :options="prirazenyUzivatelIdList"
      />
      <k-date-interval v-model="vstupDatum" label-key="vstupDatum" v-bind="{ type: 'datetime', overwriteHiddenLabel: true, showLabel: true }" />
      <k-date-interval v-model="editDatum" label-key="editDatum" v-bind="{ type: 'datetime', overwriteHiddenLabel: true }" />
    </template>
    <template #content>
      <k-table-frame v-bind="{ paging: tableBinds.paging, totalCount: tableBinds.totalCount }" v-model.paging="tableBinds.paging" v-on="tableEvents">
        <k-table
          ref="mtable"
          v-bind="{ maxHeight, ...tableBinds }"
          v-on="{ ...tableEvents }"
          v-model:columns="tableBinds.columns"
          v-model.paging="tableBinds.paging"
        >
          <template #text="{ column, nextSortIndex }">
            <k-table-column
              v-bind="{ column, labelKey: column.i18nKey, tableName: tableBinds.tableName, nextSortIndex }"
              @update:column="updateColumn($event, tableBinds.columns)"
            >
              <template #default="{ row }">
                <span class="table-paragraph" v-dompurify-html="row.text"></span>
              </template>
            </k-table-column>
          </template>
        </k-table>
      </k-table-frame>
    </template>
  </k-layout-list>
</template>

<script lang="ts">
  import { useStore as useCacheStore } from '@/template/cache';
  import { Entity } from '@/template/page/@types/page';
  import { listName } from '@/template/page/constants';
  import { init } from '@/template/page/providers/list';
  import { generateComputed } from '@/template/page/providers/store';
  import { storeToRefs } from 'pinia';
  import { defineComponent, ref, toRefs } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { NAME } from './constants';
  import { local, props as storeProps, server, tables, useStore } from './store/list';
  import { useUzivatel } from '../uzivatel/provider';

  export default defineComponent({
    name: listName(NAME),
    components: {},
    setup(props) {
      const store = useStore();
      const cacheStore = useCacheStore();
      const { t } = useI18n();

      const cache = storeToRefs(cacheStore);
      const list = init(NAME, store, props);
      const mapedLast = store.last ? generateComputed(store.last) : toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local });

      // function editRow(row: Row<RowEskalace>) {
      // 	const isEditable = (list.tableBinds.value.operations ?? 0) & OperationFlags.EDIT;
      // 	const isViewable = (list.tableBinds.value.operations ?? 0) & OperationFlags.VIEW;
      // 	if (isEditable || isViewable) {
      // 		openEdit(VOZIDLO_NAME, isEditable ? PageMode.EDIT : PageMode.VIEW, { id: row['knr'] });
      // 	}
      // }

      // function editRowClick(e: Event, row: Row<RowEskalace>) {
      // 	e.stopPropagation();
      // 	editRow(row);
      // }

      // const extraButtons = [{ ...editButton(editRowClick), isVisible: () => true }];

      const prirazenyUzivatelProvider = useUzivatel({
        filter: { selectedId: mapedLast.prirazenyUzivatelId, filteredList: mapedLast.prirazenyUzivatelIdList },
      });

      return {
        ...list,
        ...mapedLast,
        ...cache,
        t,
        NAME,
        prirazenyUzivatelProvider,
        // extraButtons,
        // editRow,
      };
    },
  });
</script>

<style lang="scss" scoped></style>
