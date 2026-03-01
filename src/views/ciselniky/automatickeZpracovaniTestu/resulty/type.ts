export type AutomatickeZpracovaniTestuResulty = {
	id: number;
	automatickeZpracovaniTestuEnum: EnumAutomatickeZpracovaniTestu; //needit link na master zaznam
	pblKod: number; //neskor mozno vyber z ciselniku => mozno nacitat text z ciselniku pbl
	text: string | null;
	vyrobniLinkaId: number | null;
};

export const enum EnumAutomatickeZpracovaniTestu {
	Brzdy = 1,
}
