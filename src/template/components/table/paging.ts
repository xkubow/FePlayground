import type { ComputedRef, Ref, WritableComputedRef } from 'vue';
import { computed, nextTick, watch } from 'vue';
import type { Paging, Row } from './@types/table';

export type Init = {
	pageCount: ComputedRef<number>;
	rowsOnPage: ComputedRef<Row[]>;
	vModelPaging: WritableComputedRef<Paging | null | undefined>;
	updateCurrentPage: (currentPage: number) => void;
};

type InitOptions = { rows?: Ref<Row[]>; paging: Ref<Paging | undefined> | undefined; totalCount?: Ref<number | undefined> };

export function usePaging({ rows, paging, totalCount }: InitOptions, emits?: (event: 'load-rows' | 'update:paging', ...args: unknown[]) => void): Init {
	const vModelPaging = computed({
		get(): Paging | null | undefined {
			return paging?.value;
		},
		set(val: Paging | null | undefined) {
			emits && emits('update:paging', val);
		},
	});

	function updateCurrentPage(currentPage: number) {
		emits && emits('update:paging', { ...paging?.value, currentPage });
	}

	const currentRowSize = computed(() => {
		return (paging?.value?.skip ?? 0) + (paging?.value?.count ?? 0);
	});

	if (paging && emits) {
		watch(
			() => ({ ...paging.value }), // or specific fields
			(p) => {
				if (!p) return;
				const { currentPage, pageSize, skip, count, backCache } = p;
				if(!currentPage || !pageSize || !backCache || !skip || !count) return;
				const from = (currentPage - 1) * pageSize;

				if (from + pageSize > currentRowSize.value) {
					vModelPaging.value!.skip = from - backCache;
					emits('load-rows');
				} else if (skip > 0 && from - pageSize < skip) {
					const newSkip = from - count + backCache;
					vModelPaging.value!.skip = newSkip < 0 ? 0 : newSkip;
					emits('load-rows');
				}
			},
			{ deep: false },
		);
	}

	const rowsOnPage = computed(() => {
		if (!paging?.value || !rows?.value) return rows?.value ?? ([] as Row[]);

		const { currentPage, pageSize, skip } = paging.value;
		const from = (currentPage - 1) * pageSize;
		const fromRows = from - skip;
		return rows.value.slice(fromRows, fromRows + pageSize);
	});

	const pageCount = computed(() => {
		const total = totalCount?.value ?? 0;
		const pageSize = paging?.value?.pageSize ?? 1;
		return Math.ceil(total / pageSize);
	});

	return { vModelPaging, rowsOnPage, pageCount, updateCurrentPage };
}
