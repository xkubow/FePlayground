import { MENU, NAME } from './constants';
import { route } from './router';
import RiCarLine from 'vue-remix-icons/icons/ri-car-line.vue';

export const Vozidlo = {
  name: NAME,
  route,
  menu: [{ i18nKey: MENU, to: NAME, icon: RiCarLine }],
};
