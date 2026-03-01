<template>
	<el-table size="small" :key="tableKey" :row-key="rowKey" :data="rowsOnPage" v-loading="vLoading"
		:summaryMethod="summaryMethod" :show-summary="showSummary" :cellClassName="cellClassName" :maxHeight="maxHeight"
		:expand-row-keys="expandRowKeys" @expand-change="expandChanged"
		@selection-change="$emit('selection-change', $event)" @row-click="rowEdit" :border="true">
		<template v-if="selectable">
			<slot name="selectable">
				<k-table-column-select v-model:selectAll="selectAll" :indeterminate="selectIndeterminate"
					:disabled="isDisabled" @selectChange="$emit('selection-change', $event)" />
			</slot>
		</template>

		<slot name="prepend" />
		<slot>
			<template v-if="isDefaultSlotEmpty">
				<slot v-for="column in columnsFiltered" :key="column.id" :name="column.id" :column="column"
					:nextSortIndex="nextSortIndex">
					<k-table-column :tableName="tableName" :labelKey="column.i18nKey" :column="column"
						:nextSortIndex="nextSortIndex" :prop="`${column.id}`" :width="column.width"
						@update:column="columnUpdate">
						<k-table-column v-for="subColumn in column.columns" :key="subColumn.id" :tableName="tableName"
							:labelKey="subColumn.i18nKey" :column="subColumn" :nextSortIndex="nextSortIndex" />
					</k-table-column>
				</slot>
			</template>
		</slot>
		<k-table-column-operations v-if="buttonColumnVisible" fixed="right" :labelKey="'operations'"
			:width="buttonsColumnWidth" :extraButtons="extraButtons" :objectName="objectName" :operations="operations"
			:rowKey="rowKey" :useRowOperations="useRowOperations" @row-add-to="$emit('row-add-to', $event)"
			@row-delete="$emit('row-delete', $event)" @row-edit="$emit('row-edit', $event)" />
	</el-table>
</template>

<script lang="ts">
import { PageMode, removesuffixFromName as removeSuffixFromName } from '@/template/page/constants';
import { openEdit } from '@/template/router/path';
import { OperationFlags } from '@/template/utils/operationFlags';
import { computed, defineComponent, ref, toRefs, watch, type PropType, type VNode } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { baseProps, useBase } from '../base/base';
import type { Column, ExtraButton, Paging, Row } from './@types/table';
import { buttonEmits, InitButtons } from './buttons';
import { useTableLocalFiltering } from './localFiltering';
import { usePaging } from './paging';
import { useTableSelect } from './selecting';
import { useTableSorting } from './sorting';
import { selectIndeterminate as tabelSelectIndeterminate } from '.';
import KTableColumn from './TableColumn.vue';
import KTableColumnOperations from './TableColumnOperations.vue';
import KTableColumnSelect from './TableColumnSelect.vue';

export default defineComponent({
	name: 'k-table',
	components: {
		KTableColumn,
		KTableColumnOperations,
		KTableColumnSelect,
	},
	emits: ['update:paging', 'selection-change', 'expand-change', 'load-rows', 'search-input', 'update:columns', 'row-clicked', ...buttonEmits],
	props: {
		...baseProps,
		objectName: { type: String },
		tableName: String,
		columns: { type: Array as PropType<Column[]>, required: true },
		rows: { type: Array as PropType<Row[]>, required: true },
		loading: { type: Boolean, default: undefined },
		loadingCount: Number,
		extraButtons: { type: Array as () => ExtraButton[] },
		columnsWidth: { type: Array as () => number[] },
		selectable: Boolean,
		maxHeight: { type: Number, default: 820 },
		paging: { type: Object as PropType<Paging> },
		totalCount: Number,
		rowKey: { type: String, required: true },
		showSummary: Boolean,
		operations: { type: Number },
		cellClassName: Function,
		summaryMethod: Function,
		expandRowKeys: { type: Array as PropType<(string | number)[]>, default: () => [] },
	},
	setup(props, { slots, emit }) {
		const propRefs = toRefs(props);
		const { paging, columns, rows, totalCount, tableName } = propRefs;
		const baseInit = useBase(propRefs);
		const { rowsfiltered } = useTableLocalFiltering({ rows, columns });
		const { rowsSorted, columnsFiltered, nextSortIndex } = useTableSorting({ columns, rows: rowsfiltered });
		const { rowsOnPage } = usePaging({ paging, rows: rowsSorted, totalCount }, emit);
		const selecting = useTableSelect(propRefs.rows, emit);
		const router = useRouter();

		// watch(
		// 	() => columns.value.map(c => c.sortingIndex),
		// 	(newVal, oldVal) => {
		// 		emit('update:paging', { ...paging.value, currentPage: 1 });

		// 		const reload = paging.value && newVal.some((c, index) => oldVal[index].sortingIndex !== c.sortingIndex);
		// 		if (reload) emit('load-rows', { tableName: tableName.value });
		// 	},
		// );

		const route = useRoute();
		const tableKey = ref(`${route.fullPath}-${tableName.value}`);

		const isDefaultSlotEmpty = computed(() => {
			return !slots.default;
		});

		const buttonsColumnWidth = computed(() => {
			const buttonCount = InitButtons.rowButtonsCount(propRefs.operations.value ?? 0) + (props.extraButtons?.length ?? 0);
			return buttonCount ? buttonCount * 60 + 20 : 0;
		});


		const buttonColumnVisible = computed(() => rowsSorted.value.length > 0 && !!buttonsColumnWidth.value);

		const selectIndeterminate = computed(() => {
			return tabelSelectIndeterminate(propRefs.rows.value);
		});

		function columnUpdate(column: Column) {
			const colIndex = columns.value.findIndex((c) => c.id === column.id);
			columns.value[colIndex] = column;
		}

		const vLoading = computed(() => {
			if (propRefs.loadingCount.value !== undefined) {
				return propRefs.loadingCount.value > 0;
			} else return propRefs.loading.value;
		});

		function getRowId(row: Row) {
			const key = propRefs.rowKey.value; // string
			return (row as any)[key] as number;
		}

		function rowEdit(row: Row) {
			const isEditable = (propRefs.operations.value ?? 0) & OperationFlags.EDIT;
			const isViewable = (propRefs.operations.value ?? 0) & OperationFlags.VIEW;
			if (isEditable || isViewable) {
				const name = router.currentRoute.value.name as string;
				const NAME = propRefs.objectName.value ?? removeSuffixFromName(name);
				openEdit(NAME, isEditable ? PageMode.EDIT : PageMode.VIEW, { id: getRowId(row) });
			} else {
				emit('row-clicked', row);
			}
		}
		function toggleAllSelection() {
			// tableRef.value?.toggleAllSelection();
		}

		const useRowOperations = computed(() => columns.value.some((c) => c.id === 'operations'));

		function expandChanged(row: Row, expandedRows: Row[]) {
			emit('expand-change', { row, expandedRows });
		}

		return {
			...baseInit,
			...selecting,
			rowsSorted,
			columnsFiltered,
			nextSortIndex,
			buttonsColumnWidth,
			buttonColumnVisible,
			tableKey,
			isDefaultSlotEmpty,
			selectIndeterminate,
			rowsOnPage,
			columnUpdate,
			vLoading,
			rowEdit,
			toggleAllSelection,
			useRowOperations,
			expandChanged,
		};
	},
});
</script>

<style scoped></style>
.