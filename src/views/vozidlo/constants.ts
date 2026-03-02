export const NAME = 'Vozidlo';
export const NAME_VYHLADAVANIE = 'VyhledatVozidlo';
export const CRUMB_LABEL_KEY = 'Vozidlo';
export const CRUMB_LABEL_KEY_VYHLADAVANIE = 'Vyhledat vozidlo';
export const MENU = 'Vozidla';
export const MENU_VYHLADAVANIE = 'Vyhledat vozidlo';
import { NAME as NAME_PRILOHY } from '../prilohy/constants';
export const SEMAFOR = 'semafor';
export const NAME_CAS_OPRAVY = 'casOpravy';

// <data android:scheme="http" android:host="zxing.appspot.com" android:path="/scan"/>
export const zxingPath1 = 'http://zxing.appspot.com/scan';
export const zxingPath = 'intent://scan#Intent;scheme=http;package=com.google.zxing.client.android;end';

export enum testStatus {
  NOT_TESTED = 0,
  OK = 1,
  NOK = 2,
  OPRAVENE = 3,
}

export const prilohyUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/${NAME}/${NAME_PRILOHY}?knr=`;
