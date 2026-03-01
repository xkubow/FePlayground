import type { DropdownItem } from '@/template/page/@types/mode';

export type VyrobniLinkaDropDownItem = {
	vyrobniZavodId: number;
	id: number;
	aktivniVerze: number;
	aktivni: boolean;
	name: string;
	text: string;
} & DropdownItem;

export type VerzeDropDownItem = {
	vyrobniLinkaId: number;
	verze: number;
} & DropdownItem;

export type VyrobniZavodDropDownItem = {
	id: number;
	name: string;
	text: string;
} & DropdownItem;
