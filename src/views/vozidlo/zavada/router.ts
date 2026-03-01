import { Path, ChildPath } from '@/template/router/path';
import { NAME } from './constants';
import Edit from './Edit.vue';
import List from './List.vue';
import { editName, createName } from '@/template/router/constants';
import type {
	NavigationGuardNext,
	RouteLocationNormalized,
	_RouteRecordBase,
} from 'vue-router';
import { PageMode } from '@/template/page/providers/pageMode';

export const route = new Path(NAME, { List }).addChildren([
  ChildPath(`:mode(${PageMode.CREATE})/:vozidloId`, createName(NAME), Edit, (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => to.params.vozidloId === undefined),
  ChildPath(`:mode(${PageMode.EDIT}|${PageMode.VIEW})/:id`, editName(NAME), Edit, (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => to.params.id === undefined),
]);
