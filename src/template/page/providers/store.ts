import { PageManagerPage, useStore } from '@/template/store/pageManager';
import { OperationFlags } from '@/template/utils/operationFlags';
import _ from 'lodash';
import type { StateTree } from 'pinia';
import { computed, type Ref, type WritableComputedOptions, type WritableComputedRef } from 'vue';
import type { RouteLocationNormalized, _RouteLocationBase } from 'vue-router';
import type { Entity } from '../@types/page';
import type { InitStoreModule } from '../@types/providers';
import type { PageStore } from '../@types/store';
import { PageModeUtils } from './pageMode';

export function init<S extends PageStore>(
  name: string,
  store: S,
  route: RouteLocationNormalized,
  props?: Record<string, unknown>,
  options?: { createNewModule: boolean; propsMapper?: (v: unknown, k: string) => unknown; propMapper?: (v: unknown, k: string) => unknown },
): InitStoreModule {
  const { createNewModule } = options ?? { createNewModule: false };
  const pageManagerStore = useStore();
  const page = _.findLast(pageManagerStore.list, (p) => p.name === name);

  const shouldRecreate = !page || store.entity.length === 0 || store.last!.id != route.params.id;

  if (shouldRecreate) {
    store.createFromDefault();
    setPropsToStore();
    setPropsToServerStore();
    PageModeUtils.isSelectList(route.params.mode as string) && store.last && (store.last.tables.table.operations = OperationFlags.SELECT);
    pageManagerStore.push(new PageManagerPage(name));
  }

  function propsMapper(v: unknown, k: string) {
    let val = v;
    if (k in route.params) {
      if (k.endsWith('Id')) {
        const number = parseInt(route.params[k] as string);
        val = Number.isNaN(number) ? null : number;
      } else val = route.params[k];
    }
    return options?.propMapper ? options.propMapper(val, k) : val;
  }

  function resetStoreState() {
    // Limit entity cache to prevent unbounded memory growth
    // Keep last 5 entities for performance, remove older ones
    if (store.entity.length > 5) {
      store.entity = store.entity.slice(-5);
    }
    // Clear other large data structures if needed
  }

  function setPropsToStore() {
    if (store.last) {
      store.last.props = _.mapValues(store.last.props, options?.propsMapper ?? propsMapper);
      store.last.id = route.params.id as string;
    }
  }

  function setPropsToServerStore() {
    if (store.last) {
      store.last.serverData = _.mapValues(store.last.serverData, options?.propsMapper ?? propsMapper);
    }
  }

  return { resetStoreState, setPropsToStore, setPropsToServerStore };
}

export type VuexComputedsReturn<S extends StateTree, L extends StateTree, P extends StateTree, T extends StateTree> = {
  [K in keyof S]: WritableComputedRef<S[K]>;
} & {
  [K in keyof L]: WritableComputedRef<L[K]>;
} & {
  [K in keyof Entity<S, L, P, T>]: WritableComputedRef<Entity<S, L, P, T>[K]>;
};

export function generateComputed<S extends StateTree, L extends StateTree, P extends StateTree, T extends StateTree>(
  entity: Entity<S, L, P, T>,
): VuexComputedsReturn<S, L, P, T> {
  const mapedEntity = _.mapValues(entity, (keyValue, key: string) => getterAndSetterFromKey(key, entity));
  const mapedServerData = _.mapValues(entity?.serverData, (keyValue, key: string) => getterAndSetterFromKey(`serverData.${key}`, entity));
  const mapedLocalData = _.mapValues(entity?.localData, (keyValue, key: string) => getterAndSetterFromKey(`localData.${key}`, entity));
  return {
    ...mapedEntity,
    ...mapedServerData,
    ...mapedLocalData,
    // ..._.mapValues(state.tables, (keyValue, key: string) => getterAndSetterFromKeyDvm(`tables.${key}`, storeUri, rootStore)),
    // ..._.mapValues(store.getters, (keyValue, key: string) => getterFromKeyDvm(key, storeUri, rootStore)),
  } as VuexComputedsReturn<S, L, P, T>;
}

export function getterAndSetterFromKey<T, S extends StateTree, L extends StateTree, P extends StateTree, TTable extends StateTree>(
  key: string,
  entity: Entity<S, L, P, TTable>,
): WritableComputedRef<T> {
  return computed({
    get(): T {
      return entity ? _.get(entity, key) : (undefined as T);
    },
    set(value: T): void {
      if (entity) {
        _.set(entity, key, value);
      }
    },
  } as WritableComputedOptions<T>);
}
