<template>
	<el-table-column
		:prop="column?.id"
		:label="labelText"
		:header-align="headerAlign"
		:align="column?.align"
		:width="column?.width"
		:show-overflow-tooltip="false"
		:sortable="false">
		<template #header>
			<slot name="header" :scope="{ column, labelKey, nextSortIndex }">
				<k-table-column-header
					:column="column"
					:labelKey="`tables.${tableName}.${labelKey}`"
					:nextSortIndex="nextSortIndex"
					@update:column="$emit('update:column', $event)"
				/>
			</slot>
		</template>
		<template #default="scope">
			<slot :row="scope.row" :column="column">
				<k-table-cell v-if="column && !column.columns" :row="scope.row" :columnId="column.id" :formatter="column.formatter" />
			</slot>
		</template>
	</el-table-column>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, type PropType } from 'vue';
import { baseProps, useBase } from '../base/base';
import type { Column } from './@types/table';
import KTableCell from './TableCell.vue';
import KTableColumnHeader from './TableColumnHeader.vue';

export default defineComponent({
	name: 'k-table-column',
	components: {
		KTableCell,
		KTableColumnHeader,
	},
	emits: ['update:column'],
	props: {
		...baseProps,
		column: { type: Object as PropType<Column> },
		tableName: String,
		headerAlign: String,
		nextSortIndex: Number,
	},
	setup(props, { slots }) {
		const propsRef = toRefs(props);
		const baseInit = useBase(propsRef);

		const hasHeaderSlot = computed(() => {
			return !!slots.header;
		});

		const width = computed(() => propsRef.column.value?.width ?? undefined);

		return { ...baseInit, hasHeaderSlot, width };
	},
});
</script>

<style scoped></style>
