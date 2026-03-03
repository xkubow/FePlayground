import { editName } from '@/template/router/constants';
import { getReplaceEditRoute } from '@/template/router/path';
import { useStore as usePageMgrStore } from '@/template/store/pageManager';
import { OperationFlags } from '@/template/utils/operationFlags';
import { isNotNull } from '@/template/utils/typeCheck';
import _ from 'lodash';
import { computed, onMounted, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter, type _RouteLocationBase } from 'vue-router';
import type { InitOptions, InitResult } from '../../@types/edit';
import type { InitTables } from '../../@types/page';
import type { PageStore } from '../../@types/store';
import { usePageMgr } from '../pageManager';
import { PageMode, pageMode } from '../pageMode';
import { init as initStore } from '../store';
import { useTables } from '../tables';
import type { AxiosResponse } from 'axios';

export type InitInput = {
  route: _RouteLocationBase;
};

export function init<S extends PageStore>(name: string, store: S, props?: Record<string, unknown>, options?: InitOptions): InitResult & InitTables {
  const router = useRouter();
  const route = useRoute();
  // const route = router.currentRoute.value;
  const mode = pageMode(router.currentRoute);

  const storeModule = initStore(editName(name), store, router.currentRoute.value, props, {
    createNewModule: !!route.meta.createNewModule,
    propsMapper: options?.propsMapper,
  });
  const entityId = computed(() => router.currentRoute.value.params.id as string);
  const pageMgrInit = usePageMgr(store, { reload: options?.reload });
  const tablesInit = useTables(store);
  const pageMgrStore = usePageMgrStore();

  const close = () => {
    router.go(-1);
  };
  const save = async (id: string = entityId.value) => {
    let doSave = true;
    if (options?.beforeSave) doSave = await options?.beforeSave(id);
    if (!doSave) return;
    const response: AxiosResponse<string | unknown> | undefined =
      id === null || id === undefined ? await store.create() : await store.update({ id: parseId(id)! });
    const respId = (response?.headers.location as string) ?? id;
    pageMgrStore.previous && (pageMgrStore.previous.toReload = true);
    if (options?.afterSave) doSave = await options?.afterSave(respId);
    return response;
  };
  const deleteEntity = (id: string = entityId.value) => {
    store.delete({ id });
  };
  const layoutListeners = {
    closeClick: () => {
      close();
    },
    saveClick: async () => {
      const result = await save(entityId.value);
      if (result !== undefined) close();
    },
    deleteClick: async () => {
      await deleteEntity(entityId.value);
      close();
    },
  };

  const loadEntity = (id: string | number = entityId.value) => {
    if (id === null || id === undefined) return store.default(store.last?.props ?? {});
    else return store.loadEntity({ id });
  };

  async function initPage() {
    if (!store.last) return;
    store.last.activeTabName = 'HlavniUdaje';
    if (mode.isFormMode.value && route.meta.createNewModule) {
      await (options?.loadEntity ? options.loadEntity() : loadEntity(store.last.id ?? entityId.value));
      await checkEditMode();

      options?.loadTables
        ? options.loadTables(store.last.serverData, tablesInit.tableNames.value)
        : tablesInit.loadTables(store.last.serverData, tablesInit.tableNames.value);
    }
  }

  onMounted(async () => {
    initPage();
  });

  async function changeToEdit() {
    store.startLoading();

    try {
      const resp = await save();
      isNotNull(resp);
      if (resp instanceof Error) {
        return resp;
      }
      const respId = resp.headers.location as string;
      if (store.last?.serverData) {
        store.last.serverData.id = parseId(respId);
        store.last.id = parseId(respId);
      }
      await changeUrlToEdit(respId);
      // storeModule.setPropsToStore();
      // storeModule.setPropsToServerStore();
      options?.reload && (await options.reload());

      return respId;
    } catch (err) {
      console.error('Change to edit ERROR:', err);
      return err;
    } finally {
      store.endLoading();
    }
  }

  function parseId(id: string | number | null) {
    return options?.parseId ? options.parseId(id) : id;
  }

  async function changeUrlToEdit(id: string | number) {
    const to = getReplaceEditRoute(name, id, PageMode.EDIT);
    await router.replace(to);

    // EventBus.$emit('Mode', this.pageMode);

    // store.commit(
    // 	`pageManager/${PGE_MGR_EDIT_PAGE}`,
    // 	{ oldPath, page: { id, path: this.$route.path } },
    // 	{ root: true },
    // );
  }

  async function changeUrlToView() {
    const to = getReplaceEditRoute(name, entityId.value, PageMode.VIEW);
    await await router.replace(to);

    // EventBus.$emit('Mode', this.pageMode);

    // store.commit(
    // 	`pageManager/${PGE_MGR_EDIT_PAGE}`,
    // 	{ oldPath, page: { id, path: this.$route.path } },
    // 	{ root: true },
    // );
  }

  onBeforeRouteUpdate((to, from, next) => {
    if (to.name === from.name && store.last && !to.meta.replacing) {
      if (to.meta.createNewModule && store.last.serverData.id != to.params.id) {
        initStore(editName(name), store, to, undefined, { createNewModule: true });
        initPage();
      } else if (!to.meta.createNewModule) {
        store.removeLastEntity();
        pageMgrStore.removeLast();
      }
    }
    next();
  });

  function saveToLocalStore(payload = store.last?.serverData ?? {}) {
    let key = route.name as string;
    key = key.replace('ClearAll', '');

    if (!key) return;
    if (!payload) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(payload));
  }

  function setFromLocalStore() {
    let key = route.name as string;
    key = key.replace('ClearAll', '');
    if (!key) return;
    const payloadStr = localStorage.getItem(key);
    if (!payloadStr || !store.last) return;
    _.merge(store.last.serverData, JSON.parse(payloadStr));
  }

  async function checkEditMode(operations: number | null = null) {
    const theOperations = operations ? operations : _.last(store.entity)?.operations;

    if (!_.isNil(theOperations) && !(theOperations & OperationFlags.EDIT)) {
      await changeUrlToView();
    }
  }

  async function refreshPage() {
    await initPage();
  }

  return {
    ...mode,
    ...storeModule,
    layoutListeners,
    ...pageMgrInit,
    ...tablesInit,
    entityId,
    save,
    changeToEdit,
    saveToLocalStore,
    setFromLocalStore,
    checkEditMode,
    refreshPage,
  };
}
