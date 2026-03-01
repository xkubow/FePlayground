import type { Row } from '@/template/components/table/@types/table';
import type { UpdateStatus } from '@/template/components/table';

export type Detail2 = {
	vozidloZavadaId?: number;
	vozidloZavadaChybaId?: number;
};

export type PracovisteVyskytuZavady = { text: string, testIo: boolean };

export type DetailId = {
	updateStatus?: UpdateStatus;
	pracovisteVyskytuZavady: PracovisteVyskytuZavady[];
	pracovisteVznikuZavadyArcId: number;
	stepTextId?: string;
	statText: string;
	errorcodeLocation: string;
	errorcodeText: string;
	errorcodeNr: number;
	errorcodeType: number;
	errorcodeTypeText: string;
	detail: Detail2[];
};

export type Detail = {
	rowNumber: number;
	selected?: boolean;
	opraveno: boolean;
} & DetailId;

export type ChybaId = {
	ptb: number;
	pblKod: number;
	ridiciJednotkaId: number;
	detail: Row<DetailId>[];
};

export type RowChyby = {
	rowNumber: number;
	selected: boolean | null;
	diagnostickaAdresa: number;
	ridiciJednotka: string;
	ridiciJednotkaText: string;
	pblText: string;
	errorcodeLocation: string;
	errorcodeType: number;
	errorcodeTypeText: string;
	errorcodeText: string;
	errorcodeNumber: number;
	opravenoVse: boolean;
	detail: Row<Detail>[];
} & ChybaId;
