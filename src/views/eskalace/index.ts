import { MENU, NAME } from './constants';
import { route } from './router';
import RiArrowUpCircleLine from 'vue-remix-icons/icons/ri-arrow-up-circle-line.vue';

export const Eskalace = {
  name: NAME,
  route,
  menu: { i18nKey: MENU, to: NAME, icon: RiArrowUpCircleLine },
};
