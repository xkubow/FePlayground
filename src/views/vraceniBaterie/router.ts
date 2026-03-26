import { Path, ChildPath } from '@/template/router/path';
import { NAME } from './constants';
import { NAME as ESKALACE_NAME } from '@/views/eskalace/constants';
import { PageMode } from '@/template/page/providers/pageMode';
import { createName } from '@/template/page/constants';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const route = new Path(NAME, {
  List: () => import('./List.vue'),
  Edit: () => import('./Edit.vue'),
}).addChildren([
  ChildPath(
    `:mode(${PageMode.CREATE})/:eskalaceId`,
    createName(`${NAME}From${ESKALACE_NAME}`),
    () => import('./Edit.vue'),
    (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => to.params.eskalaceId === undefined,
  ),
]);
