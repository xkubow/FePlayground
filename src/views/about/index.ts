import { UriType } from '@/template/menu/constants';
import { NAME } from './constants';
import { route } from './router';
import RiInformationLine from 'vue-remix-icons/icons/ri-information-line.vue';

export const About = {
  name: NAME,
  route,
  menu: { i18nKey: NAME, to: NAME, uriType: UriType.EDIT, icon: RiInformationLine },
};
