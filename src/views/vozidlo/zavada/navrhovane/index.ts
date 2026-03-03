import { MENU, NAME } from './constants';
import { route } from './router';
import RiToolsLine from 'vue-remix-icons/icons/ri-tools-line.vue';

export const VozidloZavadaNavrhovana = {
  name: NAME,
  route,
  menu: { i18nKey: MENU, to: NAME, icon: RiToolsLine },
};
