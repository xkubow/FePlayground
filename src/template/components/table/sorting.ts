import _ from 'lodash';
import type { ComputedRef, Ref, ToRefs } from 'vue';
import { computed } from 'vue';
import type { Column, Row } from './@types/table';
import { filterVisible, getFlatColumns } from '.';

export type TableSorting = {
  columnsFiltered: ComputedRef<Column[]>;
  nextSortIndex: ComputedRef<number>;
  sortethPaths: ComputedRef<Column[]>;
  rowsSorted: ComputedRef<Row[]>;
  colorAscending: ComputedRef<'blue' | 'grey'>;
  colorDescending: ComputedRef<'blue' | 'grey'>;
  sort: (ascending?: boolean) => void;
};

type Emits = (event: 'update:column', ...args: any[]) => void;

export function useTableSorting(
  { column, columns, rows }: ToRefs<{ columns?: Column[]; column?: Column; rows?: Row[] }>,
  emits?: Emits,
  sortingIndex?: Ref<number | undefined>,
): TableSorting {
  const colorAscending = computed(() => (column?.value?.sortingAscending ? 'blue' : 'grey'));
  const colorDescending = computed(() => (!_.isNil(column?.value?.sortingAscending) && !column?.value?.sortingAscending ? 'blue' : 'grey'));

  function sort(ascending?: boolean) {
    if (emits && column?.value) {
      let sortingAscending = ascending;
      if (ascending !== undefined) {
        sortingAscending = column.value?.sortingAscending === ascending ? undefined : ascending;
      } else sortingAscending = !_.isNil(column.value?.sortingAscending) && !column.value?.sortingAscending ? undefined : !column.value?.sortingAscending;
      const sortIndex = sortingAscending === undefined ? undefined : sortingIndex?.value;
      emits('update:column', { ...column.value, sortingAscending, sortingIndex: sortIndex });
    }
  }

  const columnsFiltered = computed(() => {
    return filterVisible(columns?.value ?? []);
  });

  const flatColumns = computed(() => getFlatColumns(columns?.value ?? []));

  const nextSortIndex = computed(() => {
    const indices = flatColumns.value.map((c) => c.sortingIndex);
    const maxSortIndex = _.max(indices) ?? 0;
    return maxSortIndex + 1;
  });

  const sortethPaths = computed(() =>
    _.sortBy(
      flatColumns.value.filter((c) => !_.isNil(c.sortingIndex) && !_.isNil(c.sortingAscending)),
      (c) => c.sortingIndex,
    ),
  );

  const rowsSorted = computed(() => {
    if (!rows?.value) return [];
    if (!sortethPaths.value.length) return rows.value; // no sort → no copy

    const orders = sortethPaths.value.map((c) => (c.sortingAscending ? 'asc' : 'desc'));
    const paths = sortethPaths.value.map((c) => c.id);
    return _.orderBy(rows.value, paths, orders);
  });

  return { colorAscending, colorDescending, sort, columnsFiltered, nextSortIndex, sortethPaths, rowsSorted };
}
