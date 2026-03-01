<template>
	<k-layout-list ref="listLayout" v-bind="{ operations: table?.operations, leaving }" v-on="layoutListyeners">
		<template #title> {{ t('eskalace') }} </template>
		<template #filter>
			<k-input-number label-key="knr" v-model="knr" uppercase />
			<k-input label-key="vin" v-model="vin" uppercase />
			<k-select label-key="modelovyKlic" v-model="modelovaTridaKod" multiple filterable default-first-option>
				<k-option
					v-for="item in dropDownList.modelovaTrida"
					:key="item.value"
					:label="`${item.value} - ${item.text}`"
					:value="item.value"
					:disabled="item.disabled"
				></k-option>
			</k-select>
			<k-select label-key="ridiciJednotka" v-model="RidiciJednotkaId" multiple filterable default-first-option :options="dropDownList.ridiciJednotka" />
			<k-select label-key="eskalaceStatusEnum" v-model="eskalaceStatusEnum" multiple filterable default-first-option :options="eskalaceStatusEnumList" />
			<k-select label-key="vyrobniLinka" v-model="vyrobniLinkaId" :options="dropDownList.vyrobniLinka" />
			<!--Modelova trida kod-->
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
			<k-check-box v-model="hledejPresSkupinu" label-key="hledejPresSkupinu" />
			<k-date-interval v-model="vstupDatum" label-key="vstupDatum" v-bind="{ type: 'datetime', overwriteHiddenLabel: true, showLabel: true }" />
			<k-date-interval v-model="editDatum" label-key="editDatum" v-bind="{ type: 'datetime', overwriteHiddenLabel: true }" />
		</template>
		<template #content>
			<k-table-frame v-bind="{ paging: tableBinds.paging, totalCount: tableBinds.totalCount }" v-model.paging="tableBinds.paging" v-on="tableEvents">
				<k-table
					ref="mtable"
					v-bind="{ maxHeight, ...tableBinds, objectName: VOZIDLO_NAME, extraButtons, operations: 0 }"
					v-on="{ ...tableEvents, rowClicked: editRow }"
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
import type Table from '@/template/components/table/Table.vue';
import { Entity } from '@/template/page/@types/page';
import { listName, PageMode } from '@/template/page/constants';
import { init } from '@/template/page/providers/list';
import { generateComputed } from '@/template/page/providers/store';
import { NAME as VOZIDLO_NAME } from '@/views/vozidlo/constants';
import { storeToRefs } from 'pinia';
import { defineComponent, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUzivatel } from '../uzivatel/provider';
import { NAME } from './constants';
import { local, props as storeProps, server, tables, useStore } from './store/list';
import { editButton } from '@/template/components/table/tableOperations';
import type { Row } from '@/template/components/table/@types/table';
import type { RowEskalace } from './tables/table';
import { openEdit } from '@/template/router/path';
import { OperationFlags } from '@/template/utils/operationFlags';

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
		const prirazenyUzivatelProvider = useUzivatel({
			filter: { selectedIds: mapedLast.prirazenyUzivatelId, filteredList: mapedLast.prirazenyUzivatelIdList },
		});

		function editRow(row: Row<RowEskalace>) {
			const isEditable = (list.tableBinds.value.operations ?? 0) & OperationFlags.EDIT;
			const isViewable = (list.tableBinds.value.operations ?? 0) & OperationFlags.VIEW;
			if (isEditable || isViewable) {
				openEdit(VOZIDLO_NAME, isEditable ? PageMode.EDIT : PageMode.VIEW, { id: row['knr'] });
			}
		}

		function editRowClick(e: Event, row: Row<RowEskalace>) {
			e.stopPropagation();
			editRow(row);
		}

		const extraButtons = [{ ...editButton(editRowClick), isVisible: () => true }];

		return{
			...list,
			...mapedLast,
			...cache,
			t,
			prirazenyUzivatelProvider,
			VOZIDLO_NAME,
			extraButtons,
			editRow,
		};
	},
});
</script>

<style lang="scss" scoped></style>
