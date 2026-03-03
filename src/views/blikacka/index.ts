import { MENU, NAME } from './constants';
import { route } from './router';
import RiAlarmWarningLine from 'vue-remix-icons/icons/ri-alarm-warning-line.vue';

export const Blikacka = {
  name: NAME,
  route,
  menu: { i18nKey: MENU, to: NAME, icon: RiAlarmWarningLine },
};
