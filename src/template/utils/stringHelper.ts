import _ from 'lodash';

export function toDbFieldName(stringInput: string): string {
	return _.snakeCase(stringInput).toUpperCase();
}

export function snakeToPascalCase(stringInput: string): string {
	return stringInput.split('_').map(_.capitalize).join('');
}

export function toCamelCase(strings: string[]): string[] {
	return strings.map((val) => `${val[0].toLowerCase()}${val.substring(1)}`);
}

export function objectToCamelCaseShallow(object: Record<string, unknown>): Record<string, unknown> {
	return Object.keys(object).reduce((a: Record<string, unknown>, c) => {
		a[c[0].toLowerCase() + c.substring(1)] = object[c];

		return a;
	}, {});
}

export function multiLangStringCompare(str1: string, str2: string): number {
	return new Intl.Collator(['cs', 'de', 'sk', 'en', 'fr']).compare(str1, str2);
}
export function insertFromPosition(origin: string | null, inserted: string, position: number): string {
	const originDefault = origin || '';

	return originDefault.substring(0, position) + inserted + originDefault.substring(position);
}

export function camelize(str: string): string {
	return str.replace(/(?:^\w|[A-Z_-]|\b\w|\s+)/g, (match, index) => {
		if (/\s+|[_-]/.test(match)) return '';
		return index === 0 ? match.toLowerCase() : match.toUpperCase();
	});
}
