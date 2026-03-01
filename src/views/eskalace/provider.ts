import type { Table } from '@/template/components/table';
import { useLogger } from '@/template/logger';
import type { DropdownItem } from '@/template/page/@types/mode';
import { STORE_TABLE } from '@/template/page/constants';
import _ from 'lodash';
import { computed, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiProvider as uzivatelApiProvider } from '../uzivatel/api';
import { skupinaUzivateluTyp } from '../uzivatel/skupina/constants';
import type { Skupina } from '../uzivatel/skupina/type';
import type { Uzivatel } from '../uzivatel/type';
import { apiProvider } from './api';
import { EnumEskalaceDialogType, EnumEskalaceStatus } from './constants';
import type { Eskalace } from './type';

export const eskalace = {
	knr: null as number | null,
	uzivatelSchvaluje: [] as string[],
	uzivatelSchvalujeDropDownList: [] as DropdownItem<string>[],
	schvaleniUzivatelId: null as number | null,
	schvaleniUzivatelText: null as string | null,
	schvaleniDatum: null as Date | null,
	schvalujeSkupinaUzivateluId: null as number | null,
	uzivatelPrirazeno: [] as string[],
	uzivatelPrirazenoDropDownList: [] as DropdownItem<string>[],
	prirazenaSkupinaUzivateluId: null as number | null,
	text: null as string | null,
	eskalaceStatusEnum: null as number | null,
	komentarText: null,
} as Eskalace;

export function useEskalace(
	eskalaceRef: Ref<Eskalace>,
	uzivatelSkupinaList: Ref<Skupina[]>,
	createDialog?: Ref<{ visible?: boolean; type?: EnumEskalaceDialogType }>,
	refresh?: () => void,
) {
	const { t } = useI18n();
	const title = computed(() => {
		switch (createDialog?.value.type) {
			case EnumEskalaceDialogType.DoAnalyzy:
				return t('predatDoAnalyzy');
			case EnumEskalaceDialogType.KReseni:
				return t('predatDoRieseni');
			case EnumEskalaceDialogType.DoVyroby:
				return t('predatDoVyroby');
			case EnumEskalaceDialogType.KZamietnutiu:
				return t('zamitnutEskalaci');
			case EnumEskalaceDialogType.KUzavreniu:
				return t('uzavritEskalaci');
			case EnumEskalaceDialogType.VraceniKAnalyze:
			case EnumEskalaceDialogType.OtvoreniUzavrene:
				return t('vraceniKAnalyze');
			case EnumEskalaceDialogType.KSchvaleni:
			default:
				return t('eskalace');
		}
	});
	const skupinaType = computed(() => {
		if (createDialog?.value) {
			switch (createDialog.value.type) {
				case EnumEskalaceDialogType.DoAnalyzy:
					return skupinaUzivateluTyp.analytici;
				case EnumEskalaceDialogType.KReseni:
					return skupinaUzivateluTyp.resitele;
				case EnumEskalaceDialogType.DoVyroby:
					return skupinaUzivateluTyp.repase;
				case EnumEskalaceDialogType.KZamietnutiu:
					return skupinaUzivateluTyp.repase;
				case EnumEskalaceDialogType.KUzavreniu:
					return skupinaUzivateluTyp.ostatni;
				case EnumEskalaceDialogType.KSchvaleni:
					return skupinaUzivateluTyp.analytici;
				case EnumEskalaceDialogType.OtvoreniUzavrene:
					return skupinaUzivateluTyp.analytici;
				default:
					return skupinaUzivateluTyp.analytici;
			}
		} else {
			switch (eskalaceRef.value.eskalaceStatusEnum) {
				case EnumEskalaceStatus.Analyza:
					return skupinaUzivateluTyp.analytici;
				case EnumEskalaceStatus.KeSchvaleni:
					return skupinaUzivateluTyp.analytici;
				case EnumEskalaceStatus.Uzavrena:
					return skupinaUzivateluTyp.analytici;
				case EnumEskalaceStatus.VReseni:
					return skupinaUzivateluTyp.resitele;
				case EnumEskalaceStatus.Vyroba:
					return skupinaUzivateluTyp.repase;
				default:
					return skupinaUzivateluTyp.analytici;
			}
		}
	});

	const predaniLoading = ref(false);
	async function predaniRemoteMethod(query: string) {
		if (query && query.length >= 2) {
			try {
				predaniLoading.value = true;
				const skupinaPredaniResponse = await uzivatelApiProvider.tableData<Table<Uzivatel>>({ filter: { zobrazeneJmeno: query }, tableName: STORE_TABLE });
				const tableResponse: Table<Uzivatel> = skupinaPredaniResponse?.data as Table<Uzivatel>;
				const selected = eskalaceRef.value.uzivatelPrirazenoDropDownList.filter((i) => eskalaceRef.value.uzivatelPrirazeno.includes(i.value));
				eskalaceRef.value.uzivatelPrirazenoDropDownList = [...selected, ...tableResponse.rows.map((i) => ({ value: i.id, text: i.zobrazeneJmeno }))];
			} finally {
				predaniLoading.value = false;
			}
		} else {
			eskalaceRef.value.uzivatelPrirazenoDropDownList = [];
		}
	}

	const schvalovateleLoading = ref(false);
	async function schvalovateleRemoteMethod(query: string) {
		if (query && query.length >= 2) {
			try {
				schvalovateleLoading.value = true;
				const skupinaPredaniResponse = await uzivatelApiProvider.tableData<Table<Uzivatel>>({ filter: { zobrazeneJmeno: query }, tableName: STORE_TABLE });
				const tableResponse: Table<Uzivatel> = skupinaPredaniResponse?.data as Table<Uzivatel>;
				const selected = eskalaceRef.value.uzivatelSchvalujeDropDownList.filter((i) => eskalaceRef.value.uzivatelSchvaluje.includes(i.value));
				eskalaceRef.value.uzivatelSchvalujeDropDownList = [...selected, ...tableResponse.rows.map((i) => ({ value: i.id, text: i.zobrazeneJmeno }))];
			} finally {
				schvalovateleLoading.value = false;
			}
		} else {
			eskalaceRef.value.uzivatelSchvalujeDropDownList = [];
		}
	}

	const keSchvaleni = computed(() => eskalaceRef.value.eskalaceStatusEnum === EnumEskalaceStatus.KeSchvaleni);
	const schvalena = computed(() => !_.isNil(eskalaceRef.value.schvaleniDatum));

	async function save(forceCreateOrUpdate = false) {
		if (!forceCreateOrUpdate) {
			switch (createDialog?.value.type) {
				case EnumEskalaceDialogType.DoAnalyzy:
					return null;
				case EnumEskalaceDialogType.KReseni:
					return saveKReseni();
				case EnumEskalaceDialogType.DoVyroby:
					return saveDoVyroby();
				case EnumEskalaceDialogType.KZamietnutiu:
					return saveZamitnuti();
				case EnumEskalaceDialogType.KUzavreniu:
					return saveUzavreni();
				case EnumEskalaceDialogType.OtvoreniUzavrene:
					return saveOtevreniUzavrene();
				case EnumEskalaceDialogType.KSchvaleni:
					return saveSchvaleni();
				case EnumEskalaceDialogType.KeSchvaleni:
					return savePredaniKeSchvaleni();
				case EnumEskalaceDialogType.KAnalyze:
					return savePredaniKAnalyze();
				case EnumEskalaceDialogType.VraceniKAnalyze:
					return saveVraceniKAnalyze();
				case EnumEskalaceDialogType.Vytvoreni:
					return createOrUpdate();
				default:
					return null;
			}
		} else {
			return createOrUpdate();
		}
	}

	async function createOrUpdate() {
		const logger = useLogger();
		try {
			let id = eskalaceRef.value.id;
			if (eskalaceRef.value.id) {
				await apiProvider.updateEntity(id, eskalaceRef.value);
			} else {
				const entity = {
					...eskalaceRef.value,
					eskalaceStatusEnum: EnumEskalaceStatus.KeSchvaleni,
				};
				const eskalaceRsponse = await apiProvider.createEntity(entity);
				id = parseInt(eskalaceRsponse?.headers.location as string);
			}
			// await uzivatelPriradeniApiProvider.postList(id, eskalaceRef.value.entity.uzivatelPrirazeno);
			// await uzivatelSchvalujeApiProvider.postList(id, eskalaceRef.value.entity.uzivatelSchvaluje);
			return id;
		} catch (err) {
			logger.logError(err as Error);
		} finally {
			refresh && refresh();
		}
	}

	async function schvaleni() {
		if (!createDialog) return;

		createDialog.value.type = EnumEskalaceDialogType.KSchvaleni;
		createDialog.value.visible = true;
	}
	function zamitnuti() {
		if (!createDialog) return;

		createDialog.value.type = EnumEskalaceDialogType.KZamietnutiu;
		createDialog.value.visible = true;
	}
	function doVyroby() {
		if (!createDialog) return;

		createDialog.value.type = EnumEskalaceDialogType.DoVyroby;
		createDialog.value.visible = true;
	}
	function kReseni() {
		if (!createDialog) return;

		createDialog.value.type = EnumEskalaceDialogType.KReseni;
		createDialog.value.visible = true;
	}
	function vraceniKAnalyze() {
		if (!createDialog) return;

		createDialog.value.type = EnumEskalaceDialogType.VraceniKAnalyze;
		createDialog.value.visible = true;
	}
	function otvoreniUzavrene() {
		if (!createDialog) return;

		createDialog.value.type = EnumEskalaceDialogType.OtvoreniUzavrene;
		createDialog.value.visible = true;
	}
	function uzavreni() {
		if (!createDialog) return;

		createDialog.value.type = EnumEskalaceDialogType.KUzavreniu;
		createDialog.value.visible = true;
	}
	function kAnalyze() {
		if (!createDialog) return;

		createDialog.value.type = EnumEskalaceDialogType.KAnalyze;
		createDialog.value.visible = true;
	}
	function predajKeSchvaleni() {
		if (!createDialog) return;

		createDialog.value.type = EnumEskalaceDialogType.KeSchvaleni;
		createDialog.value.visible = true;
	}

	async function saveKReseni() {
		await apiProvider.predaniKReseni(eskalaceRef.value);
		refresh && refresh();
	}
	async function saveVraceniKAnalyze() {
		await apiProvider.vraceniKAnalyze(eskalaceRef.value);
		refresh && refresh();
	}
	async function saveDoVyroby() {
		await apiProvider.predaniDoVyroby(eskalaceRef.value);
		refresh && refresh();
	}
	async function saveZamitnuti() {
		await apiProvider.zamitnuti(eskalaceRef.value);
		refresh && refresh();
	}
	async function saveUzavreni() {
		await apiProvider.uzavreni(eskalaceRef.value);
		refresh && refresh();
	}
	async function saveOtevreniUzavrene() {
		await apiProvider.UzavrenaKOtevreni(eskalaceRef.value);
		refresh && refresh();
	}
	async function saveSchvaleni() {
		await apiProvider.schvaleni(eskalaceRef.value);
		refresh && refresh();
	}
	async function savePredaniKeSchvaleni() {
		await apiProvider.predaniKeSchvaleni(eskalaceRef.value);
		refresh && refresh();
	}
	async function savePredaniKAnalyze() {
		await apiProvider.predaniKeAnalyze(eskalaceRef.value);
		refresh && refresh();
	}

	const priradeniSkupinaList = computed(() =>
		uzivatelSkupinaList.value.map((p) => ({
			...p,
			extended: p.skupinaUzivateluTypEnum !== skupinaType.value && p.id !== eskalaceRef.value.prirazenaSkupinaUzivateluId,
		})),
	);

	const schvalovateleSkupinaList = computed(() =>
		uzivatelSkupinaList.value.map((p) => ({
			...p,
			extended: p.skupinaUzivateluTypEnum !== skupinaUzivateluTyp.mistri && p.id !== eskalaceRef.value.schvalujeSkupinaUzivateluId,
		})),
	);

	return {
		predaniLoading,
		predaniRemoteMethod,
		schvalovateleLoading,
		schvalovateleRemoteMethod,
		keSchvaleni,
		save,
		schvaleni,
		zamitnuti,
		doVyroby,
		kReseni,
		vraceniKAnalyze,
		otvoreniUzavrene,
		uzavreni,
		kAnalyze,
		predajKeSchvaleni,
		skupinaType,
		title,
		priradeniSkupinaList,
		schvalovateleSkupinaList,
		schvalena,
	};
}
