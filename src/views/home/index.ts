import { UriType } from '@/template/menu/constants';
import { NAME } from './constants';
import Edit from './Edit.vue';
import { PageMode } from '@/template/page/constants';

export const route = {
  path: '/',
  name: NAME,
  redirect: { name: 'VozidloClearAllList', params: { mode: PageMode.LIST } },
  component: Edit,
};

export const Home = {
  name: NAME,
  route,
  menu: { i18nKey: NAME, to: NAME, uriType: UriType.NAME },
};
