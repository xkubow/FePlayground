import type { DropdownItem } from '@/template/page/@types/mode';
import { defineStore } from 'pinia';

export const useKeyboardStore = defineStore('simpleKeyboard', {
	state: () => ({
		dialogVisible: false,
		selectOption: undefined as DropdownItem<string | number>[] | undefined,
		selectItem: undefined as ((item: DropdownItem<string | number> & { selected?: boolean }) => void) | undefined,
	}),
});
