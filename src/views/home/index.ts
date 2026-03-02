import { UriType } from '@/template/menu/constants';
import { NAME } from './constants';
import Edit from './Edit.vue';

export const route = {
  path: '/',
  name: NAME,
  component: Edit,
};

export const Home = {
  name: NAME,
  route,
  menu: { i18nKey: NAME, to: NAME, uriType: UriType.NAME },
};
