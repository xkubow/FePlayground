import { Path, ChildPath } from '@/template/router/path';
import { NAME } from './constants';
import { NAME as ESKALACE_NAME } from '@/views/eskalace/constants';
import List from './List.vue';
import Edit from './Edit.vue';
import { PageMode } from '@/template/page/providers/pageMode';
import { createName } from '@/template/page/constants';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const route = new Path(NAME, { List, Edit }).addChildren([
        ChildPath(`:mode(${PageMode.CREATE})/:eskalaceId`, createName(`${NAME}From${ESKALACE_NAME}`), Edit, (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => to.params.eskalaceId === undefined)
    ]);
