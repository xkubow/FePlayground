import { ChildPath, Path } from '@/template/router/path';
import { NAME } from './constants';
import Edit from './Edit.vue';
import List from './List.vue';
import { NAME as MODELOVA_SKUPINA_NAME } from '@/views/ciselniky/modelovaSkupina/constants';
import { NAME as MODELOVA_TRIDA_NAME } from '@/views/ciselniky/modelovaTrida/constants';
import { NAME as RIDICI_JEDNOTKA_NAME } from '@/views/ciselniky/ridiciJednotka/constants';
import { createName, editName, PageMode } from '@/template/page/constants';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const route = [
	new Path(`${NAME}${MODELOVA_SKUPINA_NAME}`, { List }).addChildren([
		ChildPath(`:mode(${PageMode.CREATE})/:kod`, createName(`${NAME}${MODELOVA_SKUPINA_NAME}`), Edit, (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => to.params.kod === undefined),
		ChildPath(`:mode(${PageMode.EDIT}|${PageMode.VIEW})/:id/:anchor?`, editName(`${NAME}${MODELOVA_SKUPINA_NAME}`), Edit, (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => to.params.id === undefined),
	]),
	new Path(`${NAME}${MODELOVA_TRIDA_NAME}`, { List }).addChildren([
		ChildPath(`:mode(${PageMode.CREATE})/:kod`, createName(`${NAME}${MODELOVA_TRIDA_NAME}`), Edit, (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => to.params.kod === undefined),
		ChildPath(`:mode(${PageMode.EDIT}|${PageMode.VIEW})/:id/:anchor?`, editName(`${NAME}${MODELOVA_TRIDA_NAME}`), Edit, (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => to.params.id === undefined),
	]),
	new Path(`${NAME}${RIDICI_JEDNOTKA_NAME}`, { List }).addChildren([
		ChildPath(`:mode(${PageMode.CREATE})/:kod`, createName(`${NAME}${RIDICI_JEDNOTKA_NAME}`), Edit, (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => to.params.kod === undefined),
		ChildPath(`:mode(${PageMode.EDIT}|${PageMode.VIEW})/:id/:anchor?`, editName(`${NAME}${RIDICI_JEDNOTKA_NAME}`), Edit, (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => to.params.id === undefined),
	]),
];
