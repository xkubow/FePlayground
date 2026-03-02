import { i18n } from '@/template/i18n';

const { t } = i18n.global;

export enum EnumStatusIo {
  bezChyb = 0,
  opraveno = 1,
  neopraveno = 2,
}

export const statusIoList = [
  { value: EnumStatusIo.opraveno, text: t('opraveno') },
  { value: EnumStatusIo.neopraveno, text: t('neopraveno') },
  { value: EnumStatusIo.bezChyb, text: t('bezChyb') },
];
