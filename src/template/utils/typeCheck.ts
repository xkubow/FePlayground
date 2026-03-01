export function isNotNull<T>(val: T | null | undefined): asserts val is T {
	if (val === null || val === undefined) {
		throw new Error('must have value or be defined!');
	}
}

export type IndicesOf<T extends readonly unknown[], S extends readonly unknown[] = []> = T['length'] extends S['length'] ? S[number] : IndicesOf<T, [S['length'], ...S]>;
