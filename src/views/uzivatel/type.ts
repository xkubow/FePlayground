import type { DropdownItem } from "@/template/page/@types/mode";

export type Uzivatel = {
	id: string;
	dzc: string;
	mfaPerNr: string;
	jmeno: string;
	prijmeni: string;
	zobrazeneJmeno: string;
	oddeleni: string;
	email: string;
	vstupDatum: Date;
	vyrazenDatum: Date;
	vyrobniLinkaId: number;
	skupinaUzivateluId: number;
};

export type UzivatelPrirazeno = {
	uzivatelPrirazeno: string[];
	uzivatelPrirazenoDropDownList: DropdownItem<string>[];
};
