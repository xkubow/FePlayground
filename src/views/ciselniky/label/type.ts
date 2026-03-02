export type Language = {
  id: 0;
  text: string;
  jazykId: number;
  jazykPopis: string;
};

export type ModelovaTridaLanguage = { modelovaTridaKod: string } & Language;
