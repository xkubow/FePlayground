import type { EmptyObject, UnknownObject } from '@/template/@types/kTemplate';
import type { Table } from '@/template/components/table';
import type {
  PiniaCustomProperties,
  PiniaCustomStateProperties,
  StateTree,
  Store,
  _ActionsTree,
  _GettersTree,
  _StoreWithGetters,
  _StoreWithState,
} from 'pinia';
import type { UnwrapRef } from 'vue';
import type { PageActions } from './actions';
import type { Entity, Page, UnknownPage } from './page';

export type PageStore_v2<
  S,
  L,
  P,
  T extends Record<string, Table> = Record<string, Table<UnknownObject>>,
  A = UnknownObject,
  G extends _GettersTree<Page<S, L, P, T>> = EmptyObject,
> = Store<string, Page<S, L, P, T>, PageGetters<S, L, P, T> & G, PageActions & PageActionsGlobal<S, L, P, T, A>>;

export type PageStore<
  S = StateTree,
  L = StateTree,
  P = StateTree,
  T extends Record<string, Table> = Record<string, Table<UnknownObject>>,
  A = UnknownObject,
  G extends _GettersTree<Page<S, L, P, T>> = EmptyObject,
> = Store<string, Page<S, L, P, T>, PageGetters<S, L, P, T> & G, PageActions & PageActionsGlobal<S, L, P, T, A>>;

type GetterState<S, L, P, T extends Record<string, Table>> = UnwrapRef<Page<S, L, P, T>> & UnwrapRef<PiniaCustomStateProperties<Page<S, L, P, T>>>;

export type PageGetters<S = StateTree, L = StateTree, P = StateTree, T extends Record<string, Table> = StateTree> = {
  // [x: string]: ((state: GetterState<S, L, P> & UnknownObject) => any) | (() => any);
  last: (state: GetterState<S, L, P, T>) => Entity<S, L, P, T> | undefined;
  entityById: (state: GetterState<S, L, P, T>) => (id: string) => Entity<S, L, P, T> | undefined;
  loading: (state: GetterState<S, L, P, T>) => boolean;
};

export type ActionOptions<Id extends string, S, L, P, T extends Record<string, Table>, G = PageGetters<S, L, P, T>, A = PageActionsGlobal<S, L, P, T>> = A &
  ThisType<A & UnwrapRef<Page<S, L, P, T>> & _StoreWithState<Id, Page<S, L, P, T>, G, A> & _StoreWithGetters<G> & PiniaCustomProperties>;

export type PageActionsGlobal<S, L, P, T extends Record<string, Table>, A = UnknownObject> = {
  createFromDefault(): void;
  createNew(serverData: UnwrapRef<S>, localData: UnwrapRef<L>, tables: Record<string, Table>, props: UnwrapRef<P>): void;
  removeLastEntity: () => void;
  startLoading(): void;
  endLoading(): void;
} & A &
  PageActions &
  _ActionsTree;

export type UnknownPageActions = ThisType<UnwrapRef<UnknownPage> & PageStore & PageGetters & PiniaCustomProperties>;
