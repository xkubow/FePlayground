import type { UnknownObject } from '@/template/@types/kTemplate';
import { computed, type ComputedRef, type Ref, type WritableComputedRef } from 'vue';
import type { Row } from './@types/table';
import { selectAll as tableSelectAll, selectIndeterminate as tableSelectIndeterminate } from '.';

export type TableSelect = {
	selectAll: WritableComputedRef<boolean>;
	selectIndeterminate: ComputedRef<boolean>;
};

export function useTableSelect<T extends UnknownObject & { selected?: boolean }>(
	rows: Ref<Row<T>[]>,
	emit: (event: string, ...args: any[]) => void,
): TableSelect {
	return {
		selectAll: computed({
			get(): boolean {
				return !rows.value.some((r) => r.selected === undefined || r.selected === false);
			},
			set(val: boolean) {
				tableSelectAll(val, rows.value, emit);
			},
		}),

		selectIndeterminate: computed(() => {
			return tableSelectIndeterminate(rows.value);
		}),
	};
}
