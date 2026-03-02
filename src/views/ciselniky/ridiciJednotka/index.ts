import { apiProvider } from './api';
import { NAME, MENU } from './constants';
import { route } from './router';

export const RidiciJednotka = {
  name: NAME,
  apiProvider,
  route,
  menu: { i18nKey: MENU, to: NAME },
};
