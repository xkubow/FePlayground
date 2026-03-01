export const actualLocale = 'cs-Cz';
export const actualDateFormat = 'DD.MM.YYYY HH:mm:ss';

export function toLocaleDate(payload: Date | string) {
	if (typeof payload === 'string') {
		return new Date(payload).toLocaleDateString(actualLocale);
	} else {
		return payload.toLocaleDateString(actualLocale);
	}
}
export function toLocale(payload: Date | string) {
	if (typeof payload === 'string') {
		return new Date(payload).toLocaleString(actualLocale);
	} else {
		return payload.toLocaleString(actualLocale);
	}
}
