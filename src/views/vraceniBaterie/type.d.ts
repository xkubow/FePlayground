import type { DropdownItem } from '@/template/page/@types/mode';
import type { Skupina } from '../uzivatel/skupina/type';
import type { Uzivatel } from '../uzivatel/type';
import type { Komentar } from '../komentar/type';
import type { Priloha } from '../prilohy/type';
import type { ChangeLogRow } from './tables/changeLogTable';

export type SkupinaDropDown = Skupina & { extended: boolean };

export type VraceniBaterie = {
  id?: Number;
  ndNr?: string;
  bg?: string;
  fazitId?: string;
  swVersion?: Number;
  hwVersion?: string;

  komentare: Table<Komentar>;
  priloha: Table<Priloha>;
  text: string;
  komentarText?: string;
};
