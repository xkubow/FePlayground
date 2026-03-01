import type { DropdownItem } from '@/template/page/@types/mode';
import { apiProvider as skupinaApiProvider } from '../uzivatel/skupina/api';
import { apiProvider as modelovaTridaApiProvider } from './modelovaTrida/api';
import { apiProvider as modelovaSkupinaApiProvider } from './modelovaSkupina/api';
import { apiProvider as prCisloApiProvider } from './prCislo/api';
import { RidiciJednotka } from './ridiciJednotka';
import { Sqs } from './sqs';
import { TypBaterie } from './typBaterie';

export const Ciselniky = {
	async loadToCache(dropDownList: Record<string, DropdownItem[]>) {
		let response = await RidiciJednotka.apiProvider.getDropDownList();
		dropDownList.ridiciJednotka = response?.data ?? [];
		response = await Sqs.apiProvider.getSqsZavadaVinikDropDownList();
		dropDownList.sqsZavadaVinik = response?.data ?? [];
		response = await Sqs.apiProvider.getSqsZavadaTypDropDownList();
		dropDownList.sqsZavadaTyp = response?.data ?? [];
		response = await Sqs.apiProvider.getSqsZavadaKategorieDropDownList();
		dropDownList.sqsZavadaKategorie = response?.data ?? [];
		response = await Sqs.apiProvider.getSqsZavadaSkupinaDropDownList();
		dropDownList.sqsZavadaSkupina = response?.data ?? [];
		const radekResponse = await Sqs.apiProvider.getSqsZavadaRadekDropDownList();
		dropDownList.sqsZavadaRadek = radekResponse?.data ?? [];
		const skupinaTypResponse = await skupinaApiProvider.typDropDownList();
		dropDownList.skupinaTyp = skupinaTypResponse?.data ?? [];
		const modelovaTridaResponse = await modelovaTridaApiProvider.getDropDownList();
		dropDownList.modelovaTrida = modelovaTridaResponse?.data ?? [];
		const modelovaSkupinaResponse = await modelovaSkupinaApiProvider.getDropDownList();
		dropDownList.modelovaSkupina = modelovaSkupinaResponse?.data ?? [];
		const prCisloResponse = await prCisloApiProvider.getDropDownList();
		dropDownList.prCislo = prCisloResponse?.data ?? [];
		const typBaterieResponse = await TypBaterie.apiProvider.getDropDownList();
		dropDownList.typBaterie = typBaterieResponse?.data ?? [];
	},
};
