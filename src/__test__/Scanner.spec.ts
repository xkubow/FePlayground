import { describe, it, expect } from 'vitest';

function openVozidlo(id: string): string {
	const corectedKnr = id.length === 8 ? id.substring(0, 7) : id.length > 13 ? id.substring(0, 13) : id;
	const isKnr = corectedKnr.length === 13;

	return corectedKnr;
}

describe('Scanner', () => {
	it('format knr bigger then 13', () => {
		const knr = openVozidlo('3120232020670S');

		expect(knr).toEqual('3120232020670');
	});
	it('format knr length equal to 8', () => {
		const knr = openVozidlo('3120232S');

		expect(knr).toEqual('3120232');
	});
});
