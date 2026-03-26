import { PageManagerPage, useStore } from '@/template/store/pageManager';
import { findLast, get, mapValues as lodashMapValues, merge, set } from 'lodash-es';
import type { StateTree, Store } from 'pinia';
import { computed, type UnwrapRef, type WritableComputedRef } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import type { Entity, Page } from '../@types/page';
import type { InitStoreModule } from '../@types/providers';
import type { PageStore } from '../@types/store';

export function init<S extends PageStore>(
  name: string,
  store: S,
  route: RouteLocationNormalizedLoaded,
  props?: Record<string, unknown>,
  options?: { createNewModule: boolean },
): InitStoreModule {
  const { createNewModule } = options ?? { createNewModule: false };
  const pageManagerStore = useStore();
  const page = findLast(pageManagerStore.list);

  if (createNewModule || !page || store.entity.length === 0) {
    route.meta.createNewModule = 'true';
    store.createFromDefault();
    setPropsToStore();
    pageManagerStore.push(new PageManagerPage(name));
  }

  function resetStoreState() {}

  function setPropsToStore() {
    if (store.last) {
      store.last.props = route.params;
      store.last.id = route.params.id as string;
    }
  }

  function setPropsToServerStore() {
    if (store.last) {
      merge(store.last.serverData, route.params);
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

export function generateComputed<S extends StateTree, L extends StateTree, P extends StateTree, T extends StateTree, PS extends PageStore<S, L, P, T>>(
  store: PS,
): VuexComputedsReturn<S, L, P, T> {
  const entity: Entity<S, L, P, T> = store.entityDefault;

  const mapedEntity = lodashMapValues(entity, (keyValue, key: string) => getterAndSetterFromKey(key, store));
  const mapedServerData = lodashMapValues(entity?.serverData, (keyValue, key: string) => getterAndSetterFromKey(`serverData.${key}`, store));
  const mapedLocalData = lodashMapValues(entity?.localData, (keyValue, key: string) => getterAndSetterFromKey(`localData.${key}`, store));
  return {
    ...mapedEntity,
    ...mapedServerData,
    ...mapedLocalData,
  } as VuexComputedsReturn<S, L, P, T>;
}

export function getterAndSetterFromKey<
  S extends StateTree,
  L extends StateTree,
  P extends StateTree,
  TTable extends StateTree,
  PS extends PageStore<S, L, P, TTable>,
>(key: string, store: PS) {
  return computed({
    get() {
      return get(store.last, key);
    },
    set(value): void {
      set(store.last!, key, value);
    },
  });
}

export function test<S, L, P, T extends StateTree, PS extends Store<string, Page<S, L, P, T>>>(store: PS) {
  const mapedServerData = mapValues<UnwrapRef<S>, keyof UnwrapRef<S>>(store.entityDefault.serverData, store as PageStore, 'serverData');

  return {
    ...mapedServerData,
  };
}

export function getterAndSetterFromKey_v2<T>(key: string, store: PageStore) {
  return computed({
    get(): T[keyof T] {
      return get(store.last, key);
    },
    set(value: T[keyof T]): void {
      set(store.last!, key, value);
    },
  });
}

export function mapValues<T, K extends keyof T>(data: T, store: PageStore, prefix?: string) {
  const keys = Object.keys(data);
  const colector = {} as { [KK in keyof T]: WritableComputedRef<T[KK]> };

  keys.forEach((key) => {
    colector[key as K] = computed({
      get(): T[K] {
        return get(store.last, prefix ? `${prefix}.${key}` : key);
      },
      set(value: T[K]): void {
        set(store.last!, prefix ? `${prefix}.${key}` : key, value);
      },
    }) as WritableComputedRef<T[K]>;
  });

  return colector;
}
