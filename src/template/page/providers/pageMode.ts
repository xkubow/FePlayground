import { computed, type Ref } from 'vue';
import type { _RouteLocationBase } from 'vue-router';
import type { PgaeModeComputed } from '../@types/mode.d';
import { PageMode } from '../constants';
export { PageMode } from '../constants';

export class PageModeUtils {
	static isList(value?: string): boolean {
		return typeof value === 'string' && value.toUpperCase() === PageMode.LIST.toUpperCase();
	}

	static isSelectList(value?: string): boolean {
		return typeof value === 'string' && value.toUpperCase() === PageMode.SELECT_LIST.toUpperCase();
	}

	static isCreate(value?: string): boolean {
		return typeof value === 'string' && value.toUpperCase() === PageMode.CREATE.toUpperCase();
	}

	static isEdit(value?: string): boolean {
		return typeof value === 'string' && value.toUpperCase() === PageMode.EDIT.toUpperCase();
	}

	static isView(value?: string): boolean {
		return typeof value === 'string' && value.toUpperCase() === PageMode.VIEW.toUpperCase();
	}

	static getModeByDefaultView(value?: string): PageMode {
		switch (true) {
			case PageModeUtils.isList(value):
				return PageMode.LIST;
			case PageModeUtils.isSelectList(value):
				return PageMode.SELECT_LIST;
			case PageModeUtils.isCreate(value):
				return PageMode.CREATE;
			case PageModeUtils.isEdit(value):
				return PageMode.EDIT;
			default:
				return PageMode.VIEW;
		}
	}
}

export function pageMode(route: Ref<_RouteLocationBase>): PgaeModeComputed {
	const pageMode = computed((): PageMode => {
		if (!route?.value?.params?.mode) return PageMode.VIEW;
		return PageModeUtils.getModeByDefaultView(route.value.params.mode as string);
	});
	const isListMode = computed((): boolean => {
		return PageModeUtils.isList(pageMode.value);
	});
	const isSelectList = computed((): boolean => {
		return PageModeUtils.isSelectList(pageMode.value);
	});
	const isCreateMode = computed((): boolean => {
		return PageModeUtils.isCreate(pageMode.value);
	});
	const isEditMode = computed((): boolean => {
		return PageModeUtils.isEdit(pageMode.value);
	});
	const isViewMode = computed((): boolean => {
		console.log('isViewMode', pageMode.value);
		return PageModeUtils.isView(pageMode.value);
	});
	const isFormMode = computed((): boolean => {
		return isCreateMode.value || isEditMode.value || isViewMode.value;
	});
	return {
		pageMode,
		isListMode,
		isSelectList,
		isCreateMode,
		isEditMode,
		isViewMode,
		isFormMode,
	};
}
