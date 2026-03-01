import { MENU, NAME } from './constants';
import { route } from './router';

export const Language = {
	name: NAME,
	route,
	menu: { i18nKey: MENU, to: NAME },
};
