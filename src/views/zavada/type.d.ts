import { testStatus } from './constants';

export type Vozidlo = {
  testIo: boolean | null;
  modelText: string | null;
  vstupDatum: Date | null;
  editDatum: Date | null;
  vyrobaDatum: Date | null;
  knr: number | null;
  vin: string | null;
  linka: string | null;
  modelovyKlicKod: string | null;
};

export type AktualyStatus = { count: number; status: testStatus };

export type PositionStatus = {
  text: string;
  count: number;
  status: testStatus;
};

export type StatusColumn = { status: string; count: number };
