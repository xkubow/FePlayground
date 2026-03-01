import { Path } from '@/template/router/path';
import { NAME } from './constants';
import Edit from './Edit.vue';
import List from './List.vue';
import VyhledavaniVue from './Vyhledavani.vue';
import PuvodniSqs from './puvodni/Sqs.vue';
import PuvodniUps from './puvodni/Ups.vue';

export const route = new Path(NAME, { List, Edit }).addChildren([
	{ name: 'VozidloSearch', path: 'vyhledat/:id?', component: VyhledavaniVue, props: true },
	{ name: 'PuvodniSqs', path: 'puvodniSqs/:knr', component: PuvodniSqs, props: true },
	{ name: 'PuvodniUps', path: 'puvodniUps/:knr', component: PuvodniUps, props: true },
]);
