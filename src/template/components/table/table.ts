import type { UnknownObject } from '@/template/@types/kTemplate';
import type { TableOptions } from '@/template/page/@types/api';
import { Status } from '@/template/page/constants';
import type { OperationFlags } from '@/template/utils/operationFlags';
import type { CellNamesObject, Column, Paging, Row } from './@types/table';

export { UpdateStatus } from '../constants';

export enum ObjectType {
	name,
	propertyName,
}

/**
 * Table in List {@link @/main/pages/list#default} components,
 * part of the state of Edit components with dependent tables.
 */
export class Table<T extends UnknownObject = UnknownObject, F extends UnknownObject = UnknownObject, S extends UnknownObject = UnknownObject> {
	public filter?: F;
	// TODO nefunguje spravne generika -> nechce spravne otypovat :(. Musi byt UnknownObject
	public filterMapper?: (payload: { serverData: S }) => UnknownObject;
	public columns: Column[] = [];
	public rows: Row<T>[] = [];
	public name = '';
	public gridId: number | null = null;
	public emptyTextKey = 'TableMsgNoData';
	public rowKey: string | null = null;
	public sort = null as { id: number; order: string } | null;
	public loadingCount = 0;
	public operations?: OperationFlags;
	public status: Status = Status.ok;
	public cellNames: CellNamesObject | null = null;
	public hash: string | null = null;
	public isEditable = false;
	public selectable = false;
	public paging = null as Paging | null;
	public loadByEntityId = false;
	public defaultRowModel = null as Record<string, unknown> | null;
	public totalCount?: number;

	public constructor(init?: Partial<Table<T, F, S>>) {
		Object.assign(this, init);
	}

	public startLoading(): void {
		this.loadingCount += 1;
	}

	public endLoading(): void {
		this.loadingCount -= 1;
		this.loadingCount < 0 && (this.loadingCount = 0);
	}

	public isLoading(): boolean {
		return this.loadingCount > 0;
	}

	public isPaged(): boolean {
		return this.paging != null;
	}

	public tableOptions(): TableOptions {
		let result: TableOptions = {};
		const sorting = this.columns
			.filter((c) => c.sortingIndex !== undefined)
			.sort((a, b) => (a.sortingIndex! > b.sortingIndex! ? 1 : -1))
			.map((c) => `${c.id} ${c.sortingAscending ? 'asc' : 'desc'}`.trim())
			.join(',');
		if (this.paging) {
			result = {
				paging: this.paging,
				sorting,
			};
		} else {
			result = {
				paging: { count: 0 },
				sorting,
			};
		}
		return result;
	}
}

export function selectAll<T extends UnknownObject & { selected?: boolean }>(
	selected: boolean,
	rows: Row<T>[],
	emit: (event: string, ...args: any[]) => void,
): void {
	for (let i = 0; i < rows.length; i++) {
		rows[i].selected = selected;
		emit('selection-change', { checked: selected, row: rows[i] });
	}
}

export function isSelectedAll<T extends UnknownObject & { selected?: boolean }>(rows: Row<T>[]): boolean {
	return rows.some((r) => r.selected === true);
}

export function selectIndeterminate<T extends UnknownObject & { selected?: boolean }>(rows: Row<T>[]): boolean {
	const selected = rows.some((r) => r.selected === true);
	const notSelected = rows.some((r) => r.selected === false || r.selected === undefined);
	return selected && notSelected;
}

export function getFlatColumns(columns: Column[]): Column[] {
	return columns.reduce((accumulator: Column[], column: Column) => {
		if (column.columns && column.columns.length > 0) {
			return [...accumulator, ...getFlatColumns(column.columns)];
		}
		return [...accumulator, column];
	}, [] as Column[]);
}

export const filterVisible = (columns: Column[]): Column[] => {
	const result: Column[] = [];
	for (let i = 0; i < columns.length; i++) {
		const col = columns[i];
		if (col.isVisible) {
			if (col.columns) result.push({ ...col, columns: filterVisible(col.columns) });
			else result.push(col);
		}
	}
	return result;
};
