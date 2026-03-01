<template>
	<k-layout-list ref="listLayout" v-bind="{ operations: table?.operations, leaving }" v-on="layoutListyeners">
		<template #title> {{ t(MENU) }} </template>
		<template #content>
			<k-table-frame v-bind="{ paging: tableBinds.paging, totalCount: tableBinds.totalCount }" v-model.paging="tableBinds.paging" v-on="tableEvents">
				<k-table
					ref="mtable"
					v-bind="{ maxHeight, ...tableBinds, extraButtons, operations: 0 }"
					v-on="{ ...tableEvents }"
					v-model:columns="tableBinds.columns"
					v-model.paging="tableBinds.paging"
				>
					<template #vyrobniZavodId="{ column }">
						<k-table-column
							v-bind="{ tableName: tableBinds.tableName, labelKey: column.i18nKey, column, prop: `${column.id}` }"
							@update:column="updateColumn($event, tableBinds.columns)"
						>
							<template #default="{ row }">
								<k-select
									v-if="row.edit"
									v-bind="{ options: vyrobniZavodList, labelKey: 'vyrobniZavod', wrapp: false }"
									size="small"
									v-model="row.vyrobniZavodId"
								/>
								<span v-else>{{ vyrobniZavodText(row.vyrobniZavodId) }} </span>
							</template>
						</k-table-column>
					</template>
					<template #name="{ column }">
						<k-table-column
							v-bind="{ tableName: tableBinds.tableName, labelKey: column.i18nKey, column, prop: `${column.id}` }"
							@update:column="updateColumn($event, tableBinds.columns)"
						>
							<template #default="{ row }">
								<k-input v-if="row.edit" :wrapp="false" size="small" v-model="row.name" wrappClass="w-100" />
								<span v-else>{{ row.name }} </span>
							</template>
						</k-table-column>
					</template>
					<template #text="{ column }">
						<k-table-column
							v-bind="{ tableName: tableBinds.tableName, labelKey: column.i18nKey, column, prop: `${column.id}` }"
							@update:column="updateColumn($event, tableBinds.columns)"
						>
							<template #default="{ row }">
								<k-input v-if="row.edit" :wrapp="false" size="small" v-model="row.text" wrappClass="w-100" />
								<span v-else>{{ row.text }} </span>
							</template>
						</k-table-column>
					</template>
					<template #aktivni="{ column }">
						<k-table-column
							v-bind="{ tableName: tableBinds.tableName, labelKey: column.i18nKey, column, prop: `${column.id}` }"
							@update:column="updateColumn($event, tableBinds.columns)"
						>
							<template #default="{ row }">
								<k-check-box v-if="row.edit" v-model="row.aktivni" :showLabel="false" />
								<k-svg-check-box v-else v-model="row.aktivni" disabled class="jc-c" />
							</template>
						</k-table-column>
					</template>
					<template #pripravovanaVerze="{ column }">
						<k-table-column
							v-bind="{ tableName: tableBinds.tableName, labelKey: column.i18nKey, column, prop: `${column.id}` }"
							@update:column="updateColumn($event, tableBinds.columns)"
						>
							<template #default="{ row }">
								<k-row class="jc-fe">
									<span v-if="row.pripravovanaVerze" class="pr-10">{{ row.pripravovanaVerze }} </span>
									<k-button-group>
										<k-button
											v-if="isEditable && !row.edit && isLastVersionActive(row)"
											@click.stop="addVersion(row)"
											size="small"
											:icon="PlusIcon"
											:tooltip="t('tooltip.addVersion')"
										/>
										<k-button
											v-if="isEditable && !row.edit && !isLastVersionActive(row)"
											@click.stop="activateTopVersionClick(row)"
											size="small"
											:icon="TopIcon"
											:tooltip="t('tooltip.activateTopVersion')"
										/>
										<k-button
											v-if="isEditable && !row.edit && !isLastVersionActive(row)"
											@click.stop="removeVersion(row)"
											size="small"
											:icon="MinusIcon"
											:tooltip="t('tooltip.removeVersion')"
										/>
									</k-button-group>
								</k-row>
							</template>
						</k-table-column>
					</template>
				</k-table>
			</k-table-frame>
			<k-dialog v-model="activateTopVersionDialog.visible" :show-close="false" width="30%" v-on="activateTopVersionDialogEvents">
				<p>{{ t('dialog.activateTopVersion') }}</p>
			</k-dialog>
		</template>
	</k-layout-list>
</template>

<script lang="ts">
import { useStore as useCacheStore } from '@/template/cache';
import type { Row } from '@/template/components/table/@types/table';
import type Table from '@/template/components/table/Table.vue';
import { cancelButton, editButton, saveButton } from '@/template/components/table/tableOperations';
import { Entity } from '@/template/page/@types/page';
import { listName } from '@/template/page/constants';
import { init } from '@/template/page/providers/list';
import { generateComputed } from '@/template/page/providers/store';
import { OperationFlags } from '@/template/utils/operationFlags';
import { Minus as MinusIcon, Plus as PlusIcon, Top as TopIcon } from '@element-plus/icons-vue';
import _ from 'lodash';
import { storeToRefs } from 'pinia';
import { computed, defineComponent, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiProvider } from './api';
// import KnrStautsColumn from './components/KnrStatusColumn.vue';
import { MENU, NAME } from './constants';
import { useVerze } from './providers/verze';
import { local, props as storeProps, server, tables, useStore } from './store/list';
import type { RowLinka } from './tables';

export default defineComponent({
	name: listName(NAME),
	components: {},
	setup(props) {
		const mtable = ref<InstanceType<typeof Table> | null>(null);
		const store = useStore();
		const cacheStore = useCacheStore();
		const { t } = useI18n();

		const cache = storeToRefs(cacheStore);
		const list = init(NAME, store, props);
		const mapedLast = store.last ? generateComputed(store.last) : toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local });
		const activateTopVersionDialog = ref<{ visible: boolean; row: RowLinka | null }>({ visible: false, row: null });

		function editRow(e: Event, row: Row<RowLinka>) {
			e.stopPropagation();
			row.edit = true;
		}
		function cancelEditRow(e: Event, row: Row<RowLinka>) {
			e.stopPropagation();
			row.edit = false;
		}

		function isVisibleEdit(row: Row<RowLinka>) {
			return isEditable.value && !row.edit && !mapedLast.tables.value.table.rows.filter((r) => r.id !== row.id).some((r) => r.edit);
		}
		async function saveRow(e: Event, row: Row<RowLinka>) {
			e.stopPropagation();
			row.edit = false;
			const data = _.pick(row, ['vyrobniZavodId', 'id', 'aktivni', 'name', 'text']);
			await apiProvider.updateEntity(row.id, data);
			await list.filterClick();
		}

		function isVisibleSave(row: Row<RowLinka>) {
			return !!row.edit;
		}

		const extraButtons = [
			{ ...editButton(editRow), isVisible: isVisibleEdit },
			{ ...saveButton(saveRow), isVisible: isVisibleSave },
			{ ...cancelButton(cancelEditRow), isVisible: isVisibleSave },
		];

		const { verzeFilter } = useVerze(mapedLast.verzeList);

		function isLastVersionActive(row: Row<RowLinka>) {
			return _.isNil(row.pripravovanaVerze);
		}

		function vyrobniZavodText(vyrobniZavodId: number) {
			return mapedLast.vyrobniZavodList.value.find((v) => v.id === vyrobniZavodId)?.text ?? vyrobniZavodId.toString();
		}
		async function addVersion(row: Row<RowLinka>) {
			await apiProvider.addVerze(row.id);
			await store.getVerze();
			await list.filterClick();
		}

		async function activateTopVersionClick(row: Row<RowLinka>) {
			activateTopVersionDialog.value.row = row;
			activateTopVersionDialog.value.visible = true;
		}
		async function activateTopVersion() {
			const row = activateTopVersionDialog.value.row;
			if (!row) throw Error('Vyrobni linka not found');
			await apiProvider.aktivujPosledniVerzi(row.id);
			await list.filterClick();
			activateTopVersionDialog.value.row && (activateTopVersionDialog.value.row = null);
			activateTopVersionDialog.value.visible = false;
		}
		async function removeVersion(row: Row<RowLinka>) {
			await apiProvider.deleteVerze(row.id);
			await store.getVerze();
			await list.filterClick();
		}

		const activateTopVersionDialogEvents = {
			cancel: () => {
				activateTopVersionDialog.value.visible = false;
			},
			ok: () => {
				activateTopVersion();
			},
		};

		const isEditable = computed(() => !!((list.table.value?.operations ?? 0) & OperationFlags.EDIT));

		return {
			...list,
			...mapedLast,
			...cache,
			mtable,
			extraButtons,
			verzeFilter,
			isLastVersionActive,
			vyrobniZavodText,
			PlusIcon,
			TopIcon,
			MinusIcon,
			addVersion,
			activateTopVersion,
			removeVersion,
			t,
			MENU,
			activateTopVersionDialog,
			activateTopVersionClick,
			activateTopVersionDialogEvents,
			isEditable,
		};
	},
});
</script>

<style scoped></style>
