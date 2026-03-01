import type { Column, Paging, Row } from '@/template/components/table/@types/table';
import type { Table } from '@/template/components/table';
import type { PgaeModeComputed } from '@/template/page/@types/mode.d';
import type { OperationFlags } from '@/template/utils/operationFlags';
import type { Component, ComputedRef, Ref } from 'vue';

export type ListModule = {
	listeners: {
		filterClick: () => void;
	};
};

export type InitOptions = {
	loadFilterData?: () => void;
	afterDataLoad?: () => void;
	disableInitApiRequests?: boolean;
	refreshTableLayout?: () => void;
	loadRowsOnMounted?: boolean;
	reload?: () => void;
};

export type LayoutListyeners = {
	filterClick: () => void;
	createClick: () => void;
	closeClick: () => void;
};

export type TableBinds = {
	tableName: string;
	loading: boolean;
	columns: Column[];
	rows: Row[];
	paging: Paging | null;
	totalCount: number;
	rowKey: string;
	operations?: OperationFlags;
	selectable?: boolean;
};

export type InitResult = PgaeModeComputed & {
	layoutListyeners: LayoutListyeners;
	tableBinds: ComputedRef<TableBinds>;
	table: ComputedRef<Table | undefined>;
	createEntity: () => void;
	tableEvents: {
		loadRows: () => void;
		exportRows: () => void;
	};
	listLayout: Ref<(Component & { $refs: Component }) | null>;
	maxHeight: ComputedRef<number | null | undefined>;
	updateColumn: (column: Column, columns: Column[] | undefined) => void;
	loadRows: () => Promise<void>;
	keyboardShortcutsHandler: (shortcut: KeyboardEvent) => void;
};
