import { useStore } from '@/template/store/pageManager';
import { computed, onBeforeMount, onUnmounted } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import type { InitPageManager } from '../@types/page';
import type { PageStore } from '../@types/store';
import { pageMode } from './pageMode';

export function usePageMgr<T extends PageStore>(pageStore: T, options: { reload?: () => void } = {}): InitPageManager {
	const pageManagerStore = useStore();
	const router = useRouter();
	const mode = pageMode(router.currentRoute);

	const leaving = computed(() => pageManagerStore.last?.toRemove || pageManagerStore.resetAll);

	onBeforeMount(() => {
		const page = pageManagerStore.last.toRemove ? pageManagerStore.previous : pageManagerStore.last;
		page && page.toReload && options.reload && options.reload();
	});

	onUnmounted(() => {
		if (pageManagerStore.last?.toRemove) {
			pageStore.removeLastEntity();
			pageManagerStore.remove();
		}
		if (pageManagerStore.resetAll) {
			pageManagerStore.resetAll = false;
		}
	});
	onBeforeRouteLeave((to, from) => {
		if (mode.isSelectList.value && pageManagerStore?.previous) {
			pageManagerStore.previous.toReload = true;
		}
		if (pageManagerStore?.previous && pageManagerStore.previous.name === to.name) {
			pageManagerStore.last.toRemove = true;
			pageManagerStore.previous.toReload = true;
		}
		if (to.meta.clearAllPages) {
			pageManagerStore.removeAll();
			pageManagerStore.resetAll = true;
			pageManagerStore.resetAllPages();
		}
	});

	return { leaving };
}
