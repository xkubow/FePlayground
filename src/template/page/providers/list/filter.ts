import _ from 'lodash';
import { nextTick, onMounted } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import type { FilterInit } from '../../@types/filter.d';
import type { InitOptions } from '../../@types/list';
import type { PageStore } from '../../@types/store';
import { STORE_TABLE } from '../../constants';

export function init<S extends PageStore>(pageStore: S, route: RouteLocationNormalizedLoaded, options: InitOptions = { loadRowsOnMounted: true }): FilterInit {
	async function loadFilterData() {
		await pageStore.filter(pageStore.last?.serverData ?? {});
	}

	async function filterClick() {
		await pageStore.tableData({
			filter: pageStore.last?.serverData ?? {},
			tableName: STORE_TABLE,
		});
		saveFilterToLocalStore();
		nextTick(() => {
			options?.refreshTableLayout && options?.refreshTableLayout();
		});
	}
	function filterResetClick() {
		if (!pageStore.last?.serverData) return;
		pageStore.last.serverData = _.cloneDeep(pageStore.entityDefault.serverData);
	}

	function toggleFilter() {
		options?.refreshTableLayout && options?.refreshTableLayout();
	}

	const filterListeners = { filterClick, toggleFilter, filterResetClick };

	onMounted(async () => {
		if (route.meta.createNewModule) {
			if (!options?.disableInitApiRequests) {
				await (options?.afterDataLoad ? options?.afterDataLoad() : loadFilterData());
			}
			setFilterFromLocalStore();
			if (options.loadRowsOnMounted) {
				filterListeners.filterClick();
			}
			options?.afterDataLoad && (await options?.afterDataLoad());
		}
	});

	function saveFilterToLocalStore(filter = pageStore.last?.serverData ?? {}) {
		let key = route.name as string;
		if (!key) return;
		key = key.replace('ClearAll', '');

		if (!filter) {
			localStorage.removeItem(key);
			return;
		}
		localStorage.setItem(key, JSON.stringify(filter));
	}

	function setFilterFromLocalStore() {
		let key = route.name as string;
		if (!key) return;
		key = key.replace('ClearAll', '');
		
		const filterStr = localStorage.getItem(key);
		if (!filterStr || !pageStore.last) return;
		_.mergeWith(pageStore.last.serverData, JSON.parse(filterStr), (a, b) => (a === null || (_.isArray(a) && a.length === 0) ? b : a));
	}

	return { loadFilterData, filterListeners: filterListeners, filterClick, toggleFilter, saveFilterToLocalStore, setFilterFromLocalStore, filterResetClick };
}
