import { UriType } from '@/template/menu/constants';
import { NAME, VYHLEDAT_VOZIDLO_APP_MENU, VYHLEDAT_VOZIDLO_APP_URI } from './constants';
import { route } from './router';

export const Scanner = {
  name: NAME,
  route,
  menu: [
    {
      i18nKey: VYHLEDAT_VOZIDLO_APP_MENU,
      to: VYHLEDAT_VOZIDLO_APP_URI,
      uriType: UriType.PATH,
    },
    { i18nKey: 'vyhledatVozidlo', to: 'BarcodeScennerVozidlo', uriType: UriType.NAME },
  ],
};
