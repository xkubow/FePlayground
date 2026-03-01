import { defineStore } from 'pinia';
import { NAME } from './constants';

export const useMenuStore = defineStore(NAME, {
	state: () => ({
		defaultActive: null as string | null,
	}),
});
