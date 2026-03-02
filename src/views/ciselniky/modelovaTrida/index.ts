import { apiProvider } from './api';
import { NAME, MENU } from './constants';
import { route } from './router';

export const ModelovaTrida = {
  name: NAME,
  apiProvider,
  route,
  menu: { i18nKey: MENU, to: NAME },
};
