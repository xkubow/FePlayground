import { MENU, NAME } from './constants';
import { route } from './router';

export const Uzivatel = {
	name: NAME,
	route,
	menu: { i18nKey: MENU, to: NAME },
};
