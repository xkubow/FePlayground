import { Path, ChildPath } from '@/template/router/path';
import { selectListName, editName } from '@/template/router/constants';
import { PageMode } from '@/template/page/providers/pageMode';
import { NAME } from './constants';
import Edit from './Edit.vue';
import List from './List.vue';
import type { RouteLocationNormalized } from 'vue-router';

export const route = new Path(NAME, { List, Edit });
