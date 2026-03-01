import type { NamedValue, TranslateOptions } from 'vue-i18n';

export type T = {
	(key: string | number): string;
	(key: string | number, plural: number, options?: TranslateOptions | undefined): string;
	(key: string | number, defaultMsg: string, options?: TranslateOptions | undefined): string;
	(key: string | number, list: unknown[], options?: TranslateOptions | undefined): string;
	(key: string | number, list: unknown[], plural: number): string;
	(key: string | number, list: unknown[], defaultMsg: string): string;
	(key: string | number, named: NamedValue, options?: TranslateOptions | undefined): string;
	(key: string | number, named: NamedValue, plural: number): string;
	(key: string | number, named: NamedValue, defaultMsg: string): string;
};
