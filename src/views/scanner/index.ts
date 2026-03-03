import { UriType } from '@/template/menu/constants';
import { NAME, VYHLEDAT_VOZIDLO_APP_MENU, VYHLEDAT_VOZIDLO_APP_URI } from './constants';
import { route } from './router';
import RiQrScan2Line from 'vue-remix-icons/icons/ri-qr-scan-2-line.vue';

export const Scanner = {
  name: NAME,
  route,
  menu: [
    {
      i18nKey: VYHLEDAT_VOZIDLO_APP_MENU,
      to: VYHLEDAT_VOZIDLO_APP_URI,
      uriType: UriType.PATH,
      icon: RiQrScan2Line,
    },
    { i18nKey: 'vyhledatVozidlo', to: 'BarcodeScennerVozidlo', uriType: UriType.NAME, icon: RiQrScan2Line },
  ],
};
