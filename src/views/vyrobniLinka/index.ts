import { MENU, NAME } from './constants';
import { route } from './router';

export const VyrobniLinka = {
  name: NAME,
  route,
  menu: { i18nKey: MENU, to: NAME },
};
