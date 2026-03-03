import { MENU, NAME } from './constants';
import { route } from './router';
import RiBatteryChargeLine from 'vue-remix-icons/icons/ri-battery-charge-line.vue';

export const VraceniBaterie = {
  name: NAME,
  route,
  menu: { i18nKey: MENU, to: NAME, icon: RiBatteryChargeLine },
};
