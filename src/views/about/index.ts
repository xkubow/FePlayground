import { UriType } from '@/template/menu/constants';
import { NAME } from './constants';
import { route } from './router';

export const About = {
  name: NAME,
  route,
  menu: { i18nKey: NAME, to: NAME, uriType: UriType.EDIT },
};
