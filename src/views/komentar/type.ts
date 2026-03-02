export type Komentar = {
  id: number;
  text: string;
  vstupDatum: Date;
  vstupUzivatelZobrazeneJmeno: string;
};

export type LoadEskalaceKomentar = (eskalaceId: number) => Promise<void>;
