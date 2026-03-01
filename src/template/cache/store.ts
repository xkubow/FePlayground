import { apiProvider as apiProviderNastaveni } from '@/views/administrace/nastaveni/api';
import type { Nastaveni } from '@/views/administrace/nastaveni/type';
import { Ciselniky } from '@/views/ciselniky';
import type { SqsZavadaRadek, SqsZavadaSkupina } from '@/views/ciselniky/types';
import { apiProvider as apiProvidervyrobniLinka } from '@/views/vyrobniLinka/api';
import { defineStore } from 'pinia';
import type { DropdownItem } from '../page/@types/mode';
import { NAME } from './constants';
import _ from 'lodash';
import { USE_SW_KEYBOARD } from '../constants';

export const useStore = defineStore(NAME, {
	state: () => ({
		cacheLoaded: false,
		loading: false,
		nastaveni: null as Nastaveni | null,
		dropDownList: {
			ridiciJednotka: [] as DropdownItem[],
			vyrobniLinka: [] as DropdownItem[],
			skupinaTyp: [] as DropdownItem[],
			modelovaTrida: [] as DropdownItem[],
			modelovaSkupina: [] as DropdownItem[],
			prCislo: [] as DropdownItem[],
			sqsZavadaVinik: [] as DropdownItem[],
			sqsZavadaTyp: [] as DropdownItem[],
			sqsZavadaKategorie: [] as DropdownItem[],
			sqsZavadaSkupina: [] as SqsZavadaSkupina[],
			sqsZavadaRadek: [] as SqsZavadaRadek[],
			typBaterie: [] as DropdownItem[],
		},
	}),
	getters: {},
	actions: {
		clear() {
			this.dropDownList.ridiciJednotka = [];
			this.dropDownList.skupinaTyp = [];
			this.dropDownList.modelovaTrida = [];
			this.dropDownList.modelovaSkupina = [];
			this.dropDownList.prCislo = [];
			this.dropDownList.sqsZavadaVinik = [];
			this.dropDownList.sqsZavadaTyp = [];
			this.dropDownList.sqsZavadaKategorie = [];
			this.dropDownList.sqsZavadaSkupina = [];
			this.dropDownList.sqsZavadaRadek = [];
			this.dropDownList.typBaterie = [];
		},
		async loadCache() {
			this.loading = true;
			await Ciselniky.loadToCache(this.dropDownList);
			const responseNastaveni = await apiProviderNastaveni.loadEntity();
			if (responseNastaveni?.data) {
				this.nastaveni = _.merge(this.nastaveni, responseNastaveni.data);
			}
			const responseVyrobniLinka = await apiProvidervyrobniLinka.getDropDownList();
			this.dropDownList.vyrobniLinka = responseVyrobniLinka?.data ?? [];

			this.cacheLoaded = true;
			this.loading = false;
			if (!_.isNil(localStorage.getItem(USE_SW_KEYBOARD))) {
				const val = JSON.parse(localStorage.getItem(USE_SW_KEYBOARD) ?? 'false');
				this.nastaveni ? (this.nastaveni.useSwKeyboard = val) : (this.nastaveni = { useSwKeyboard: val, prilohaVelikostMax: null });
			}
		},
	},
});
