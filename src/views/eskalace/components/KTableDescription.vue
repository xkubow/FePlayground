<template>
	<table class="description_table sectioned">
		<caption>
			{{
				t('popis')
			}}
		</caption>
		<tbody style="border-collapse: collapse" v-for="(e, i) in eskalace" :key="e.id">
		<tr class="d-n">
			<th>{{ t('text') }}</th>
			<th>{{ t('hodnota') }}</th>
		</tr>
			<tr>
				<td>{{ t('ridiciJednotka') }} :</td>
				<td>{{ ridiciJednotka && ridiciJednotka[i] }}</td>
			</tr>
			<tr>
				<td>{{ t('resitele') }} :</td>
				<td>{{ uzivatelPriradeniText && uzivatelPriradeniText[i].join(', ') }}</td>
			</tr>
			<tr>
				<td>{{ t('stavEskalace') }} :</td>
				<td>{{ stavEskalaceText && stavEskalaceText[i] }}</td>
			</tr>
			<tr v-if="eskalace && !eskalace[i].schvaleniUzivatelText && uzivatelSchvaluje && uzivatelSchvaluje[i]">
				<td>{{ t('schvalovatele') }} :</td>
				<td>{{ uzivatelSchvaluje[i].join(', ') }}</td>
			</tr>
			<tr v-if="eskalace && eskalace[i].schvaleniUzivatelText">
				<td>{{ t('schvalil') }} :</td>
				<td>{{ eskalace && eskalace[i].schvaleniUzivatelText }}</td>
			</tr>
		</tbody>
	</table>
</template>

<script setup lang="ts">
import { EnumEskalaceStatus } from '@/views/eskalace/constants';
import { computed, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Eskalace, SkupinaDropDown } from '../type';
import { useStore as useCacheStore } from '@/template/cache';

export interface Props {
	eskalace?: Eskalace[] | null;
	uzivatelSkupinaList: SkupinaDropDown[] | null | undefined;
}

const cacheStore = useCacheStore();
const props = defineProps<Props>();
const { eskalace, uzivatelSkupinaList } = toRefs(props);

const { t } = useI18n();

const stavEskalaceText = computed(() => {
	return eskalace?.value?.map((e) => {
		switch (e.eskalaceStatusEnum) {
			case EnumEskalaceStatus.Uzavrena:
				return t('uzavrena');
			case EnumEskalaceStatus.Vyroba:
				return `${t('vyroba')}(${t('repas')})`;
			case EnumEskalaceStatus.KeSchvaleni:
				return t('schvalovana');
			case EnumEskalaceStatus.Analyza:
				return t('analyza');
			case EnumEskalaceStatus.VReseni:
				return t('VReseni');
			default:
				return '';
		}
	});
});

const ridiciJednotka = computed(() =>
	eskalace?.value?.map((e) => {
		const tt = cacheStore.dropDownList.ridiciJednotka.find((p) => p.value === e.ridiciJednotkaId)?.text;
		return tt;
	}),
);

const uzivatelPriradeniText = computed(() =>
	eskalace?.value?.map((e) => [
		uzivatelSkupinaList.value?.find((d) => d.id === e.prirazenaSkupinaUzivateluId)?.text,
		...(e.uzivatelPrirazenoDropDownList?.filter((i) => e.uzivatelPrirazeno.includes(i.value)).map((t) => t.text) ?? []),
	]),
);
const uzivatelSchvaluje = computed(() =>
	eskalace?.value?.map((e) => [
		uzivatelSkupinaList.value?.find((d) => d.id === e.schvalujeSkupinaUzivateluId)?.text,
		...(e.uzivatelSchvalujeDropDownList?.filter((i) => e.uzivatelSchvaluje.includes(i.value)).map((t) => t.text) ?? []),
	]),
);
</script>

<style lang="scss" scoped>
table {
	border-collapse: collapse;
}

table.sectioned tbody {
	border: 1px solid var(--el-border-color);
	border-radius: var(--el-border-radius-round);
	border-collapse: separate;
	border-spacing: 4px;
}

tbody tr td:first-child {
	width: 8em;
	min-width: 8em;
	max-width: 8em;
	word-break: break-all;
}
</style>
