import { Path, ChildPath } from '@/template/router/path';
import { selectListName, editName } from '@/template/router/constants';
import { PageMode } from '@/template/page/providers/pageMode';
import { NAME, NAME_SKUPINA_UZIVATEL } from './constants';
import Edit from './Edit.vue';
import List from './List.vue';
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

export const route = new Path(NAME, { List, Edit }).addChildren([
  ChildPath(
    `:mode(${PageMode.SELECT_LIST})/:skupinaUzivateluId`,
    selectListName(NAME),
    List,
    (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => to.params.skupinaUzivateluId === undefined,
  ),
  ChildPath(
    `:mode(${PageMode.EDIT})/:id`,
    editName(NAME_SKUPINA_UZIVATEL),
    Edit,
    (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => to.params.id === undefined,
  ),
]);
