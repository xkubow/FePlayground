export const NAME = 'eskalace';
export const CRUMB_LABEL_KEY = 'eskalace';
export const MENU = 'eskalace';
import { i18n } from '@/template/i18n';
import type { DropdownItem } from '@/template/page/@types/mode';

const { t } = i18n.global;

export const enum EnumEskalaceStatus {
	KeSchvaleni = 1,
	Analyza = 2,
	VReseni = 3,
	Vyroba = 4,
	Uzavrena = 5,
}

export const enum EnumEskalaceDialogType {
	Vytvoreni = 0,
	KSchvaleni = 1,
	KZamietnutiu = 2,
	DoAnalyzy = 3,
	KReseni = 4,
	DoVyroby = 5,
	KUzavreniu = 6,
	KAnalyze = 7,
	KeSchvaleni = 8,
	VraceniKAnalyze,
	OtvoreniUzavrene,
}

export const eskalaceStatusEnumList: DropdownItem[] = [
	{ value: EnumEskalaceStatus.KeSchvaleni, text: t('KeSchvaleni') },
	{ value: EnumEskalaceStatus.Analyza, text: t('Analyza') },
	{ value: EnumEskalaceStatus.VReseni, text: t('VReseni') },
	{ value: EnumEskalaceStatus.Vyroba, text: t('Vyroba') },
	{ value: EnumEskalaceStatus.Uzavrena, text: t('Uzavrena') },
];
