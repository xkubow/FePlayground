export const maskKnr = (knr: string | undefined) =>
	knr ? `${knr.slice(0, 2)} ${knr.slice(2, 6)} ${knr.slice(6, 8)} ${knr.slice(8, 9)} ${knr.slice(9, 13)}` : '';
