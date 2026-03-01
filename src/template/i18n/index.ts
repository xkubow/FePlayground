import type { App } from 'vue';
import { createI18n } from 'vue-i18n';
import cz from './cz.json';

export const i18n = createI18n({
	legacy: false,
	locale: 'cz',
	fallbackLocale: 'cz',
	messages: {
		cz,
	},
	missingWarn: false,
	fallbackWarn: false,
});

export default {
	install: (app: App): App => {
		app.use(i18n);

		return app;
	},
};
