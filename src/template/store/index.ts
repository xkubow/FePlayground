import type { StoreGeneric } from 'pinia';
import { createPinia } from 'pinia';
import type { App } from 'vue';
import { NAME as NAME_AUTHORIZATION } from '../account/authorization/constants';
import { NAME as NAME_CACHE } from '../cache/constants';
import { NAME as NAME_LOGGER } from '../logger/constants';
import { NAME as NAME_PAGE_MANAGHER } from './pageManager/constants';

const stores: StoreGeneric[] = [];

const resetAllStores = () => {
	for (const store of stores) {
		store.$reset();
	}
	// stores = [];
};
const resetAllPages = () => {
	for (const store of stores) {
		if (![NAME_PAGE_MANAGHER, NAME_AUTHORIZATION, NAME_LOGGER, NAME_CACHE].includes(store.$id)) store.$reset();
	}
	// stores = [];
};

const logStoreCache = () => {
	// for (const store of stores) {
	// }
};

export default {
	install: (app: App): App => {
		const pinia = createPinia();
		pinia.use(({ store }) => {
			stores.push(store);
		});
		pinia.use(() => ({ resetAllStores, logStoreCache, resetAllPages }));
		app.use(pinia);

		return app;
	},
};
