import { ChildPath, Path } from '@/template/router/path';
import { NAME } from './constants';
import { PageMode, selectListName } from '@/template/page/constants';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const route = new Path(NAME).addChildren([
  ChildPath(
    `:mode(${PageMode.SELECT_LIST})/:vozidloStitekId`,
    selectListName(NAME),
    () => import('./List.vue'),
    (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => to.params.vozidloStitekId === undefined,
  ),
]);
