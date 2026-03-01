export const STORE_TABLE = 'table';

export enum ListLoadBehavior {
	// Start with displayed filter and automatically load list items. Default behavior.
	AUTO_LOAD = 'AUTO_LOAD',
	// Start with displayed filter and do not automatically load list items.
	NO_LOAD = 'NO_LOAD',
	// Start with hidden filter and automatically load list items.
	HIDE_FILTER = 'HIDE_FILTER',
	// Automatically load list items but dont selet if is just one record.
	AUTO_SELECT_OFF = 'AUTO_SELECT_OFF',
}

export enum Status {
	ok = 'success',
	error = 'error',
}

// export const PAGE_EDIT = 'Edit';
// export const PAGE_LIST = 'List';
// export const PAGE_SELECT_LIST = 'Select';

export enum PageMode {
	LIST = 'List',
	SELECT_LIST = 'Select',
	CREATE = 'Create',
	EDIT = 'Edit',
	REPLACE_EDIT = 'ReplaceEdit',
	CLEAR_ALL_EDIT = 'ClearAllEdit',
	CLEAR_ALL_LIST = 'ClearAllList',
	VIEW = 'View',
}

/** Appends {@link PAGE_EDIT} to `prefix`. */
export function editName(prefix: string): string {
	return `${prefix}${PageMode.EDIT}`;
}

export function replaceEditName(prefix: string): string {
	return `${prefix}${PageMode.REPLACE_EDIT}`;
}
export function clearAllEditName(prefix: string): string {
	return `${prefix}${PageMode.CLEAR_ALL_EDIT}`;
}

export function createName(prefix: string): string {
	return `${prefix}${PageMode.CREATE}`;
}

export function viewName(prefix: string): string {
	return `${prefix}${PageMode.VIEW}`;
}

/** Appends {@link PAGE_LIST} to `prefix`. */
export function listName(prefix: string): string {
	return `${prefix}${PageMode.LIST}`;
}
export function clearAllListName(prefix: string): string {
	return `${prefix}${PageMode.CLEAR_ALL_LIST}`;
}

/** Appends {@link PAGE_SELECT_LIST} to `prefix`. */
export function selectListName(prefix: string): string {
	return `${prefix}${PageMode.SELECT_LIST}`;
}

/** Appends {@link STORE_LIST} to `prefix`. */
export function removesuffixFromName(name: string): string {
	const regExp = new RegExp(`(${PageMode.LIST})|(${PageMode.EDIT})|(${PageMode.SELECT_LIST})|(${PageMode.CLEAR_ALL_EDIT})|(${PageMode.CLEAR_ALL_LIST})`);
	return name.replace(regExp, '');
}
