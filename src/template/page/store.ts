import type { BaseApi } from '@/template/page/api';
import { cloneDeep, last } from 'lodash-es';
import type { StateTree, StoreDefinition, _ActionsTree, _GettersTree } from 'pinia';
import { defineStore } from 'pinia';
import type { UnwrapRef } from 'vue';
import type { Page } from './@types/page';
import { Entity } from './@types/page';
import type { ActionOptions, PageActionsGlobal, PageGetters } from './@types/store';
import { pageActions } from './actions';

export const pageStoreFactory = <
  Id extends string,
  Provider extends BaseApi,
  S extends StateTree,
  L extends StateTree,
  P extends StateTree,
  T extends StateTree,
  G extends _GettersTree<Page<S, L, P, T>>,
  A extends _ActionsTree,
>({
  name,
  apiProvider,
  page,
  extraGetters,
  extraActions,
}: {
  name: Id;
  apiProvider?: Provider;
  page: Page<S, L, P, T>;
  extraGetters: G;
  extraActions: A;
}): StoreDefinition<Id, Page<S, L, P, T>, PageGetters<S, L, P, T> & G, PageActionsGlobal<S, L, P, T, A>> =>
  defineStore<Id, Page<S, L, P, T>, PageGetters<S, L, P, T> & G, PageActionsGlobal<S, L, P, T, A>>(name, {
    state: (): Page<S, L, P, T> => ({ ...cloneDeep(page) }),
    getters: {
      last: (state) => last(state.entity),
      entityById: (state) => (id: string) => state.entity.find((e) => e.id === id),
      loading: (state) => (last(state.entity)?.loadingCount ?? 0) > 0,
      ...extraGetters,
    },
    actions: {
      ...pageActions({ apiProvider }),
      createFromDefault() {
        this.entity.push(cloneDeep(this.entityDefault));
      },
      createNew(serverData: UnwrapRef<S>, localData: UnwrapRef<L>, tables: UnwrapRef<T>, props: UnwrapRef<P>) {
        const entity = new Entity(serverData, localData, tables, props);
        this.entity.push(entity);
      },
      removeLastEntity() {
        if (this.entity.length > 0) this.entity.pop();
      },
      startLoading() {
        this.last && (this.last.loadingCount += 1);
      },
      endLoading() {
        this.last && (this.last.loadingCount -= 1);
      },
      ...extraActions,
    } as ActionOptions<Id, S, L, P, T, PageGetters<S, L, P, T>, PageActionsGlobal<S, L, P, T, A>>,
  });
