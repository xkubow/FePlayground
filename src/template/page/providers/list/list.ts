import { updateColumn } from '@/template/components/table/localFiltering';
import { openEdit } from '@/template/router/path';
import { computed, nextTick, onBeforeMount, onBeforeUnmount, provide, ref, type Component } from 'vue';
import { useRouter } from 'vue-router';
import type { FilterInit } from '../../@types/filter.d';
import type { InitOptions, InitResult, TableBinds } from '../../@types/list';
import type { InitPageManager } from '../../@types/page';
import type { PageStore } from '../../@types/store';
import { usePageMgr } from '../pageManager';
import { PageMode, pageMode } from '../pageMode';
import { init as initStore } from '../store';
import { listName, STORE_TABLE } from './../../constants';
import { init as initFilter } from './filter';
import { useI18n } from 'vue-i18n';
import { forceFileDownload, parseObj2Csv } from '@/template/utils/fileHelper';

export function init<S extends PageStore>(
  name: string,
  store: S,
  props?: Record<string, unknown>,
  options: InitOptions = { loadRowsOnMounted: true },
): InitResult & FilterInit & InitPageManager {
  const router = useRouter();
  const route = router.currentRoute.value;
  const mode = pageMode(router.currentRoute);
  const { t } = useI18n();

  const storeModule = initStore(listName(name), store, router.currentRoute.value, props);
  const pageMgrInit = usePageMgr(store, { reload: options.reload ?? loadRows });
  const filterModule = initFilter(store, route, options);

  const listLayout = ref<(Component & { $refs: Component }) | null>(null);
  const maxHeight = computed(() => {
    return window.innerHeight - 132;
  });

  const tableBinds = computed(
    () =>
      ({
        tableName: store.last?.tables[STORE_TABLE].name,
        columns: store.last?.tables[STORE_TABLE].columns,
        rows: store.last?.tables[STORE_TABLE].rows,
        loading: store.last?.tables[STORE_TABLE].isLoading() ?? false,
        paging: store.last?.tables[STORE_TABLE].paging,
        totalCount: store.last?.tables[STORE_TABLE].totalCount,
        rowKey: store.last?.tables[STORE_TABLE].rowKey,
        operations: store.last?.tables[STORE_TABLE].operations,
        selectable: store.last?.tables[STORE_TABLE].selectable,
      }) as TableBinds,
  );

  async function loadRows() {
    nextTick(() => {
      filterModule.filterClick();
    });

    // await store.tableData({
    // 	filter: store.last?.serverData ?? {},
    // 	tableName: STORE_TABLE,
    // });
  }
  const tableEvents = { loadRows, exportRows };

  const table = computed(() => store.last?.tables[STORE_TABLE]);

  const createEntity = () => {
    openEdit(name, PageMode.CREATE);
  };

  function exportRows() {
    const table = store.last?.tables[STORE_TABLE];
    const fields = table?.columns.filter((p) => p.isVisible).map((p) => ({ label: t(`tables.${table.name}.${p.id}`), value: p.id })) ?? [];
    const encodedCsv = encodeURIComponent(parseObj2Csv(table?.rows as unknown[], fields));
    const url = `data:text/csv;charset=utf-8,%EF%BB%BF${encodedCsv}`;
    return forceFileDownload(url);
  }

  const layoutListeners = {
    ...filterModule.filterListeners,
    createClick: () => {
      createEntity();
    },
    closeClick: () => {
      router.go(-1);
    },
  };

  provide('mode', mode.pageMode);

  onBeforeMount(() => {
    window.addEventListener('keydown', keyboardShortcutsHandler);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', keyboardShortcutsHandler);
  });

  function keyboardShortcutsHandler(shortcut: KeyboardEvent) {
    if (shortcut.key === 'Enter') {
      filterModule.filterClick();
    }
  }

  return {
    ...mode,
    ...storeModule,
    ...filterModule,
    tableBinds,
    createEntity,
    layoutListyeners: layoutListeners,
    ...pageMgrInit,
    table,
    tableEvents,
    listLayout,
    maxHeight,
    updateColumn,
    loadRows,
    keyboardShortcutsHandler,
  };
}
