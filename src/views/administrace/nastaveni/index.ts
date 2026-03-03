import { UriType } from '@/template/menu/constants';
import { MENU, NAME } from './constants';
import { route } from './router';
import RiSettings3Line from 'vue-remix-icons/icons/ri-settings-3-line.vue';

export const Nastaveni = {
  name: NAME,
  route,
  menu: { i18nKey: MENU, to: NAME, uriType: UriType.EDIT, id: 0, icon: RiSettings3Line },
};
