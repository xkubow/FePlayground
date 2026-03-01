import { Path } from '@/template/router/path';
import { NAME } from './constants';
import KBarcodeVue from './KBarcode.vue';

export const route = new Path(NAME).addChildren([{ name: 'BarcodeScennerVozidlo', path: 'vyhledat/', component: KBarcodeVue }]);
