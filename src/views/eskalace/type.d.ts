import type { DropdownItem } from '@/template/page/@types/mode';
import type { Skupina } from '../uzivatel/skupina/type';
import type { Uzivatel } from '../uzivatel/type';
import type { Komentar } from '../komentar/type';
import type { Priloha } from '../prilohy/type';
import type { ChangeLogRow } from './tables/changeLogTable';
import type { VraceniBaterie } from '../vraceniBaterie/type.d';

export type SkupinaDropDown = Skupina & { extended: boolean };

export type Eskalace = {
  komentare: Table<Komentar>;
  priloha: Table<Priloha>;
  changeLog: Table<ChangeLogRow>;
  id: number;
  knr: number;
  uzivatelSchvaluje: string[];
  uzivatelSchvalujeDropDownList: DropdownItem<string>[];
  schvaleniUzivatelId: number;
  schvaleniUzivatelText: string;
  vstupUzivatelText: string;
  schvaleniDatum: Date;
  schvalujeSkupinaUzivateluId: number;
  uzivatelPrirazeno: string[];
  uzivatelPrirazenoDropDownList: DropdownItem<string>[];
  prirazenaSkupinaUzivateluId: number | null;
  text: string;
  eskalaceStatusEnum: number;
  operationEskalaceCreate: boolean;
  operationVozidloStitekUpdate: boolean;
  operationEskalaceSchvaleni: boolean;
  operationEskalacePredani: boolean;
  operationEskalaceCloseNiO: boolean;
  operationDeletePriloha: boolean;
  komentarText: string | null;
  ridiciJednotkaId: number | null;
  vraceniBaterieId: number | null;
  vraceniBaterie: VraceniBaterie | null;
};
