import NotFound from '@/template/page/NotFound.vue';
import type {
	NavigationFailure,
	NavigationGuardNext,
	NavigationGuardWithThis,
	RouteComponent,
	RouteLocationNormalized,
	RouteLocationRaw,
	RouteMeta,
	RouteParamsRaw,
	RouteRecordRaw,
	_RouteRecordBase,
} from 'vue-router';
import { clearAllEditName, clearAllListName, replaceEditName, type ListLoadBehavior } from '../page/constants';
import { PageMode } from '../page/providers/pageMode';
import { editName, listName, selectListName } from './constants';
import EmptyRouterView from './EmptyRouterView.vue';
import { router } from './index';

declare type _RouteRecordProps = boolean | Record<string, unknown> | ((to: RouteLocationNormalized) => Record<string, unknown>);

declare interface RouteRecordSingleView extends _RouteRecordBase {
	component: RouteComponent;
	components?: never;
	props?: _RouteRecordProps;
}

type Components = {
	List?: RouteComponent;
	SelectList?: RouteComponent;
	Edit?: RouteComponent;
	Default?: RouteComponent;
};

export class Path implements RouteRecordSingleView {
	beforeEnter?: NavigationGuardWithThis<undefined> | NavigationGuardWithThis<undefined>[];
	component: RouteComponent;
	meta?: { objectName: string };
	children: RouteRecordRaw[] = [];
	path;

	constructor(public name: string = '', components: RouteComponent | Components = EmptyRouterView) {
		this.path = name;
		this.name = name;
		// eslint-disable-next-line no-param-reassign
		const isComponents = Object.keys(components).every((key) => ['List', 'SelectList', 'Edit', 'Default'].includes(key));
		if (!isComponents) {
			components = { Default: components };
		}

		const children = [];

		if ('List' in components) {
			children.push({
				path: `:mode(${PageMode.LIST})/:filter?`,
				component: components.List,
				name: listName(name),
				props: true,
				meta:{createNewModule: 'true', keepPrevious: 'true'},
			});
			children.push({
				path: `:mode(${PageMode.LIST})/:filter?`,
				component: components.List,
				name: clearAllListName(name),
				props: true,
				meta:{createNewModule: 'true', keepPrevious: 'true', clearAllPages: 'true'},
			});
		}

		if ('SelectList' in components) {
			children.push({
				path: `:mode(${PageMode.SELECT_LIST})`,
				component: components.SelectList,
				meta: { hasList: 'list' in components, createNewModule: 'true', keepPrevious: 'true' },
				name: selectListName(name),
				props: true,
			});
		}

		if ('Edit' in components) {
			children.push(editPath(name, components.Edit));
			children.push(replaceEditPath(name, components.Edit));
			children.push(clearAllEditPath(name, components.Edit));
		}

		children.length > 0 && this.addChildren(children);

		this.component = 'Default' in components ? components.Default : EmptyRouterView;
	}

	addChildren(children: RouteRecordRaw[]): Path {
		const last = this.children.pop() || { path: 'NotFound', component: NotFound };
		this.children.push(...children, last);
		return this;
	}
}

export function editPath(
	name: string,
	component: RouteComponent,
	options: { useDirectName: boolean; checkId: boolean; modes: PageMode[] } = { useDirectName: false, checkId: true, modes: [] },
): RouteRecordRaw {
	const modes = options.modes.length > 0 ? options.modes.join('|') : `${PageMode.CREATE}|${PageMode.EDIT}|${PageMode.VIEW}`;
	return {
		path: `:mode(${modes})/:id?/:anchor?`,
		component,
		name: options.useDirectName ? name : editName(name),
		props: true,
		meta:{createNewModule: 'true', keepPrevious: 'true'},
		beforeEnter(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
			if (options.checkId && (to.params.mode === PageMode.CREATE) !== (to.params.id === undefined)) {
				return next({ path: '/404', replace: true });
			}
			return next();
		},
	};
}

export function replaceEditPath(
	name: string,
	component: RouteComponent,
): RouteRecordRaw {
	return {
		path: `:mode(${PageMode.EDIT})/:id?/:anchor?`,
		component,
		name: replaceEditName(name),
		props: true,
		meta:{replacing: 'true'},
		beforeEnter(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
			if (to.params.id === undefined) {
				return next({ path: '/404', replace: true });
			}
			return next();
		},
	};
}

export function clearAllEditPath(
	name: string,
	component: RouteComponent,
): RouteRecordRaw {
	return {
		path: `:mode(${PageMode.EDIT})/:id?/:anchor?`,
		component,
		name: clearAllEditName(name),
		props: true,
		meta:{createNewModule: 'true', clearAllPages: 'true' },
		beforeEnter(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
			if (to.params.id === undefined) {
				return next({ path: '/404', replace: true });
			}
			return next();
		},
	};
}

export function ChildPath(
	path: string,
	name: string,
	component: RouteComponent,
	beforeEnterConditions: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => boolean,
): RouteRecordRaw {
	return {
		path,
		component,
		name,
		props: true,
		meta:{createNewModule: 'true', keepPrevious: 'true'},
		beforeEnter(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
			if (beforeEnterConditions(to, from, next)) {
				return next({ path: '/404', replace: true });
			}

			return next();
		},
	};
}

/*
 * Opens new Edit component.
 *
 * @param name - name of the component, eg. 'Vozidlo'.
 * @param mode - page mode
 * @param args
 */
export function openEdit(
	name: string,
	mode: PageMode,
	args?: {
		id?: number | string;
		filter?: Record<string, unknown>;
		[key: string]: unknown;
	},
	useReplace = false,
): Promise<void | NavigationFailure | undefined> {
	const route = {
		name: editName(name),
		params: { ...(args as RouteParamsRaw), mode/*, destroy: 'TODO is this arg necessary?', createNewModule: 'true', keepPrevious: 'true'*/ },
	};
	return useReplace ? router.replace(route) : router.push(route);
}

export function openPage(
	name: string,
	mode: PageMode,
	args?: {
		id?: number | string;
		filter?: Record<string, unknown>;
		[key: string]: unknown;
	},
	useReplace = false,
): Promise<void | NavigationFailure | undefined> {
	const route = {
		name,
		params: { ...(args as RouteParamsRaw), mode/*, destroy: 'TODO is this arg necessary?', createNewModule: 'true', keepPrevious: 'true'*/ },
	};
	return useReplace ? router.replace(route) : router.push(route);
}

export function openList(
	name: string,
	args?: {
		// filter?: Record<string, unknown>;
		listLoadBehavior?: ListLoadBehavior;
		[key: string]: unknown;
	},
): Promise<void | NavigationFailure | undefined> {
	return router.push({
		name: listName(name),
		params: { ...(args as RouteParamsRaw), mode: PageMode.LIST, /*createNewModule: 'true', keepPrevious: 'true'*/ },
	});
}

export function openSelectList(
	name: string,
	args?: {
		filter?: Record<string, unknown>;
		listLoadBehavior?: ListLoadBehavior;
		[key: string]: unknown;
	},
): Promise<void | NavigationFailure | undefined> {
	return router.push({
		name: selectListName(name),
		params: { ...(args as RouteParamsRaw), mode: PageMode.SELECT_LIST, /*createNewModule: 'true', keepPrevious: 'true' */},
	});
}

export function getReplaceEditRoute(name: string, id: string | number | null, mode: PageMode = PageMode.EDIT): RouteLocationRaw {
	const params = {
		mode,
		...(id ? { id: id.toString() } : {})
	};

	return {
		name: replaceEditName(name),
		params,
	};
}
