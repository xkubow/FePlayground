import type { PgaeModeComputed } from '@/template/page/@types/mode.d';
import type { ComputedRef } from 'vue';

export type InitOptions = {
	loadEntity?: (id?: string) => void;
	loadTables?: (filter?: Record<string, unknown>, tablesToFetch?: string[]) => void;
	beforeSave?: (id?: string) => Task<boolean>;
	afterSave?: (id?: string) => Promise<boolean>;
	reload?: () => void;
	parseId?: (id: string | number | null) => string | number | null;
	propsMapper?: (v: unknown, k: string) => unknown;
	propMapper?: (v: unknown, k: string) => unknown;
};

export type LayoutListeners = {
	closeClick: () => void;
	saveClick: () => void;
	deleteClick: () => void;
};

export type InitResult = PgaeModeComputed & {
	entityId: ComputedRef<string>;
	save: (id: string) => void;
	layoutListeners: LayoutListeners;
	leaving: Ref<boolean>;
	changeToEdit: () => Promise<unknown>;
	saveToLocalStore: (payload?: StateTree) => void;
	setFromLocalStore: () => void;
	checkEditMode: (operations: number | null = null) => Promise<void>;
	refreshPage: () => Promise<void>;
};
