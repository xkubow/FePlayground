import { i18n } from '@/template/i18n';
import type { DropdownItem } from '@/template/page/@types/mode';

const { t } = i18n.global;

export const NAME = 'vraceniBaterie';
export const CRUMB_LABEL_KEY = 'vraceniBaterie';
export const MENU = 'baterie';

export enum EnumVraceniBaterieStatus {
  zalozeno = 1,
  vReseni = 2,
  uzavreno = 3,
  zamitnuto = 4,
}

export enum EnumVraceniBaterieStav {
  vPoradku = 1,
  nekriticka = 2,
  kriticka = 3,
  nebezpecna = 4,
}

export const vraceniBaterieStatusList: DropdownItem[] = [
  { value: EnumVraceniBaterieStatus.zalozeno, text: t('Zalozeno') },
  { value: EnumVraceniBaterieStatus.vReseni, text: t('VReseni') },
  { value: EnumVraceniBaterieStatus.uzavreno, text: t('Uzavrena') },
  { value: EnumVraceniBaterieStatus.zamitnuto, text: t('Zamitnuto') },
];

export const vraceniBaterieStavList: DropdownItem[] = [
  { value: EnumVraceniBaterieStav.vPoradku, text: t('vPoradku') },
  { value: EnumVraceniBaterieStav.nekriticka, text: t('nekriticka') },
  { value: EnumVraceniBaterieStav.kriticka, text: t('kriticka') },
  { value: EnumVraceniBaterieStav.nebezpecna, text: t('nebezpecna') },
];
