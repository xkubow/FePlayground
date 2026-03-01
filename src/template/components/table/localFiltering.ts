import { computed, type ComputedRef, type Ref } from 'vue';
import type { Column, Row } from './@types/table';

export type TableLoaclFiltering = {
	columnUpdate: (column: Column) => void;
	rowsfiltered: ComputedRef<Row[]>;
};

export function filterRows(columns?: Column[], rows?: Row[]) {
	if (!columns || !rows) return [] as Row[];
	const doFilter = columns.some((c) => !!c.filter);
	return doFilter ? rows.filter((row) => columns?.some((c) => c.filter && String(row[c.id]).localeInclude(c.filter))) : rows;
}

export function updateColumn(column: Column, columns: Column[] | undefined) {
	if (!columns) return;
	const colIndex = columns.findIndex((c) => c.id === column.id);
	columns[colIndex] = column;
}

export function useTableLocalFiltering({ rows, columns }: { rows: Ref<Row[] | undefined>; columns: Ref<Column[] | undefined> }): TableLoaclFiltering {
	const rowsfiltered = computed(() => {
		return filterRows(columns.value, rows.value);
	});

	function columnUpdate(column: Column) {
		updateColumn(column, columns.value);
	}

	return { rowsfiltered, columnUpdate };
}
