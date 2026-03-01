<template>
	<k-layout-list ref="listLayout" v-bind="{ operations: table?.operations, leaving }" v-on="layoutListyeners">
		<template #title> {{ t(MENU) }} </template>
		<template #content>
			<k-table-frame v-bind="{ paging: tableBinds.paging, totalCount: tableBinds.totalCount }" v-model.paging="tableBinds.paging" v-on="tableEvents">
				<k-table
					ref="mtable"
					v-bind="{ maxHeight, ...tableBinds }"
					v-on="tableEvents"
					@row-delete="rowDelete"
					v-model:columns="tableBinds.columns"
					v-model.paging="tableBinds.paging"
					:cellStyle="cellStyle"
				>
					<template #uiBarvaKod="{ column, nextSortIndex }">
						<k-table-column
							v-bind="{ column, labelKey: column.i18nKey, tableName: tableBinds.tableName, nextSortIndex }"
							@update:column="updateColumn($event, tableBinds.columns)"
						>
							<template #default="{ row }">
								<span>{{ converToHexaColor(row.uiBarvaKod) }}</span>
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
import { useStore as usePageManagerStore } from '@/template/store/pageManager';
import { storeToRefs } from 'pinia';
import { defineComponent, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { MENU, NAME } from './constants';
import { local, props as storeProps, server, tables, useStore } from './store/list';
import type { Barva } from './type';
import { apiProvider } from './api';

export default defineComponent({
	name: listName(NAME),
	setup(props) {
		const store = useStore();
		const pageManagerStore = usePageManagerStore();
		const cacheStore = useCacheStore();
		const { t } = useI18n();

		const cache = storeToRefs(cacheStore);
		const list = init(NAME, store, props);
		const mapedLast = store.last ? generateComputed(store.last) : toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local });

		function converToHexaColor(uiBarvaKod: number) {
			if (uiBarvaKod) {
				let barva = uiBarvaKod.toString(16);
				const zeroCount = 6 - barva.length;
				for (let i = 0; i < zeroCount; i++, barva = `0${barva}`);
				return `#${barva.toUpperCase()}`;
			}
			return undefined;
		}

		function cellStyle({ row, columnIndex }: { row: Barva; columnIndex: number }) {
			return columnIndex === 1 ? { backgroundColor: converToHexaColor(row.uiBarvaKod) } : undefined;
		}

		function rowDelete(row: Barva) {
			apiProvider.deleteEntity(row.barva2Kod);
			list.loadRows();
		}

		return {
			...list,
			...mapedLast,
			...cache,
			MENU,
			t,
			converToHexaColor,
			cellStyle,
			rowDelete,
		};
	},
});
</script>

<style scoped></style>
