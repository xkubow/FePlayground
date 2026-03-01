import { ActionTypes, MutationTypes } from '../authorization/store/types';
import type { Kontakt } from './../../../views/uzivatel/type.d';

//https://gist.github.com/soerenmartius/ad62ad59b991c99983a4e495bf6acb04

export type State = {
	isAuthorized: boolean;
	passwordReset: boolean;
	passwordExpired: boolean;
	user: Kontakt | null;
};

export type Mutations<S = State> = {
	[MutationTypes.AUTHORIZE](state: S, payload: Partial<State>): void;
};

export interface Actions {
	[ActionTypes.AUTHORIZE](context: AugmentedActionContext, payload: { login: string; password: string }): Promise<unknown>;
	[ActionTypes.UN_AUTHORIZE](context: AugmentedActionContext): Promise<unknown>;
}

type AugmentedActionContext = {
	commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>;
	dispatch<K extends keyof Actions>(key: K, payload?: Parameters<Actions[K]>[1], options?: DispatchOptions): ReturnType<Actions[K]>;
};

export type Commit = (
	key: keyof Mutations,
	payload: Parameters<Mutations[keyof Mutations]>[1],
	options?: CommitOptions,
) => ReturnType<Mutations[keyof Mutations]>;
