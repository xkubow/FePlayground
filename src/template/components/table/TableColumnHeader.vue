<template>
	<div class="k-table-header">
		<div>{{ labelText }}</div>
		<k-row class="column-icons">
			<slot name="actions" />
			<table-column-search v-if="column?.filterable" @update:filter="updateFilter(column, $event )" :filter="column?.filter" />
			<div v-if="column?.sortable" class="k-table-header-buttons">
				<el-icon :size="20" :color="colorAscending" @click="sort(true)">
					<caret-top-icon viewBox="0 -300 1024 1024" />
				</el-icon>
				<el-icon :size="20" :color="colorDescending" @click="sort(false)">
					<caret-bottom-icon viewBox="0 300 1024 1024" />
				</el-icon>
			</div>
		</k-row>
	</div>
</template>

<script lang="ts">
import { CaretBottom as CaretBottomIcon, CaretTop as CaretTopIcon } from '@element-plus/icons-vue';
import { defineComponent, toRefs } from 'vue';
import { baseProps, useBase } from '../base/base';
import type { Column } from './@types/table';
import { useTableSorting } from './sorting';
import TableColumnSearch from './TableColumnSearch.vue';

export default defineComponent({
	name: 'k-table-column-header',
	props: {
		...baseProps,
		column: { type: Object as () => Column },
		nextSortIndex: Number,
	},
	emits: ['search-input', 'update:column'],
	components: {
		CaretTopIcon,
		CaretBottomIcon,
		TableColumnSearch,
	},
	setup(props, { emit }) {
		const propsRef = toRefs(props);
		const { column, nextSortIndex } = propsRef;
		const baseInit = useBase(propsRef);
		const { colorAscending, colorDescending, sort } = useTableSorting({ column }, emit, nextSortIndex);

		const updateFilter = (col: Column, filterValue: any) => {
			emit('update:column', { ...col, filter: filterValue });
		};

		return { ...baseInit, colorAscending, colorDescending, sort, updateFilter };
	},
});
</script>

<style scoped>
.column-icons {
	align-items: center;
	position: absolute;
	right: 0;
}
.column-icons i:hover {
	color: var(--el-color-primary);
}
</style>
