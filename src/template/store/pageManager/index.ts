import { defineStore } from 'pinia';
import { NAME } from './constants';
import _ from 'lodash';

export class PageManagerPage {
	toRemove: boolean;
	toReload: boolean;
	constructor(public name: string) {
		this.toRemove = false;
		this.toReload = false;
	}
}

export class PageManager {
	list: PageManagerPage[] = [];
	resetAll = false;
}

export const useStore = defineStore(NAME, {
	state: (): PageManager => ({
		list: [],
		resetAll: false,
	}),
	getters: {
		previous: ({ list }) => {
			const previousIndex = list.length - 2;
			if (previousIndex < 0) return null;
			return list[previousIndex];
		},
		last: ({ list }) => {
			return list[list.length - 1];
		},
	},
	actions: {
		push(page: PageManagerPage) {
			this.list.push(page);
		},
		removeLast() {
			if (this.list.length > 0) this.list.pop();
		},
		remove() {
			if (this.list.length === 0)
				return;
			_.remove(this.list, p => p.toRemove);
		},
		removeAll() {
			this.list = [];
		},
	},
});
