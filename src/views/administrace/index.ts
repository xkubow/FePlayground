import { UriType } from '@/template/menu/constants';
import { MENU, NAME } from './constants';
import { route } from './router';

export const Administrace = {
	name: NAME,
	route,
	menu: { i18nKey: MENU, to: NAME, uriType: UriType.EDIT },
};
