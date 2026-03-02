import { EnumStatusIo } from '@/views/chyby/constants';
import { testStatus } from './constants';

export type Vozidlo = {
  statusIoEnum: EnumStatusIo | null;
  modelText: string | null;
  vstupDatum: Date | null;
  editDatum: Date | null;
  vyrobaDatum: Date | null;
  knr: number | null;
  vin: string | null;
  linka: string | null;
  modelovyKlicKod: string | null;
  m100CisloZavesu: number | null;
  motorText: string | null;
  zakladniMotorText: string | null;
  prevodovkaText: string | null;
  operationEskalaceCreate: boolean | null;
  operationVozidloStitekUpdate: boolean | null;
  operationEskalaceZnovuotevreni: boolean | null;
  operationDeletePriloha: boolean | null;
  fin: boolean | null;
  zavadaVN: boolean | null;
  baterieVyjmuta: boolean | null;
  systemPohonu: SystemPohonu | null;
};

export type AktualyStatus = { count: number; status: testStatus };

export type PositionStatus = {
  text: string;
  count: number;
  status: testStatus;
};

export type StatusColumn = { status: string; count: number };

export type NavrhovanaZavadaSelected = {
  rowNumber: number;
  sqsZavadaSkupinaId: number;
  definiceZavadyId: number;
  sqsZavadaTypId: number;
  sqsZavadaVinikId: number;
  sqsZavadaRadekId: number;
};

export enum SystemPohonu {
  BezAlternativniho = 0, //0K0	Bez alternativního systému pohonu
  Plynovy = 2, //0K2	Plynový systém pohonu
  PluginHybrid = 3, //0K3	Hybridní systém pohonu PHEV
  MildHybrid = 4, //0K4	Hybridní systém pohonu M-HEV
  Elektro = 9, //0K9	Systém pohonu BEV
}

export class CasOpravyVozidla {
  id: number | null;
  uzivatelId: string;
  knr: number | null;
  vozidloZavadaId: number | null;
  casZacatek: DateTime;
  dobaOpravyMinuty: number;
  text: string | null;
  vstupUzivatelId: string;
  vstupUzivatelZobrazeneJmeno: string;
  vstupDatum: Date;
  editUzivatelId: string;
  editUzivatelZobrazeneJmeno: string;
  editDatum: Date;
  sqsZavadaMistoText: string;
  sqsZavadaTypText: string;
  sqsZavadaVinikText: string;
}
