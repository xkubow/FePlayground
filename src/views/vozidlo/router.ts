import { Path } from '@/template/router/path';
import { NAME } from './constants';

export const route = new Path(NAME, {
  List: () => import('./List.vue'),
  Edit: () => import('./Edit.vue'),
}).addChildren([
  { name: 'VozidloSearch', path: 'vyhledat/:id?', component: () => import('./Vyhledavani.vue'), props: true },
  { name: 'PuvodniSqs', path: 'puvodniSqs/:knr', component: () => import('./puvodni/Sqs.vue'), props: true },
  { name: 'PuvodniUps', path: 'puvodniUps/:knr', component: () => import('./puvodni/Ups.vue'), props: true },
]);
