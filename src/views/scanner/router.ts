import { Path } from '@/template/router/path';
import { NAME } from './constants';

export const route = new Path(NAME).addChildren([
  { name: 'BarcodeScennerVozidlo', path: 'vyhledat/', component: () => import('./KBarcode.vue') },
]);
