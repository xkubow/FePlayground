import { Path } from '@/template/router/path';
import { NAME } from './constants';

export const route = new Path(NAME, {
  List: () => import('./List.vue'),
  Edit: () => import('./Edit.vue'),
});
