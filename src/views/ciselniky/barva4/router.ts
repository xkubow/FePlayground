import { Path } from '@/template/router/path';
import { NAME } from './constants';
import Edit from './Edit.vue';
import List from './List.vue';

export const route = new Path(NAME, { List, Edit });
