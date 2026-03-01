<template>
	<k-layout-list ref="listLayout" v-bind="{ operations: table?.operations, leaving }" v-on="layoutListyeners">
		<template #title> Seznam vozidel </template>
		<template #filter> </template>
		<template #content>
			<k-table-frame v-bind="{ paging: tableBinds.paging, totalCount: tableBinds.totalCount }" v-model.paging="tableBinds.paging" v-on="tableEvents">
				<k-table
					ref="mtable"
					v-bind="{ maxHeight, ...tableBinds }"
					v-on="tableEvents"
					v-model:columns="tableBinds.columns"
					v-model.paging="tableBinds.paging"
				/>
			</k-table-frame>
		</template>
	</k-layout-list>
</template>

<script lang="ts">
import { useStore as useCacheStore } from '@/template/cache';
import type Table from '@/template/components/table/Table.vue';
import { Entity } from '@/template/page/@types/page';
import { listName } from '@/template/page/constants';
import { init } from '@/template/page/providers/list';
import { generateComputed } from '@/template/page/providers/store';
import { storeToRefs } from 'pinia';
import { defineComponent, ref, toRefs } from 'vue';
// import KnrStautsColumn from './components/KnrStatusColumn.vue';
import { NAME } from './constants';
import { local, props as storeProps, server, tables, useStore } from './store/list';

export default defineComponent({
	name: listName(NAME),
	components: {
		// KnrStautsColumn,
	},
	setup(props) {
		const store = useStore();
		const cacheStore = useCacheStore();

		const cache = storeToRefs(cacheStore);
		const list = init(NAME, store, props);
		const mapedLast = store.last ? generateComputed(store.last) : toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local });

		return {
			...list,
			...mapedLast,
			...cache,
		};
	},
});
</script>

<style scoped></style>
