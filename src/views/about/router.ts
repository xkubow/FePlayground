import { Path } from '@/template/router/path';
import { NAME } from './constants';

export const route = new Path(NAME, { Edit: () => import('./Edit.vue') });
