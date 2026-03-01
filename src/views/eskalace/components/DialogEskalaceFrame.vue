<template>
	<k-row>
		<k-col :span="24">
			<k-row>
				<k-select
					:span="12"
					label-key="ridiciJednotka"
					show-more
					v-model="propsRef.eskalace.value.ridiciJednotkaId"
					:options="cacheStore.dropDownList.ridiciJednotka"
					filterable
					:clearable="false"
				/>
			</k-row>
			<k-row>
				<k-select
					v-if="!kUzavreni"
					:span="5"
					label-key="UzivateleSkupina"
					show-more
					:modelValue="prirazenaSkupinaUzivateluId"
					@update:modelValue="emits('update:prirazenaSkupinaUzivateluId', $event)"
					v-bind="{ optionsValueName: 'id', optionsTextName: 'text' }"
					:options="priradeniSkupinaList"
				/>
				<k-select
					v-if="!kUzavreni"
					:span="19"
					:label="`${t('dalsi')} ${t('uzivatel', 2).toLowerCase()}`"
					:modelValue="uzivatelPrirazeno"
					@update:modelValue="emits('update:uzivatelPrirazeno', $event)"
					multiple
					filterable
					remote
					reserve-keyword
					:remote-method="predaniRemoteMethod"
					:loading="predaniLoading"
					:options="propsRef.eskalace.value.uzivatelPrirazenoDropDownList"
				/>
			</k-row>
			<k-row>
				<k-select
					v-if="schvalovatelVisible"
					:span="5"
					label-key="SchvalovateleSkupina"
					show-more
					v-model="propsRef.eskalace.value.schvalujeSkupinaUzivateluId"
					v-bind="{ optionsValueName: 'id', optionsTextName: 'text' }"
					:options="schvalovateleSkupinaList"
				/>
				<k-select
					v-if="schvalovatelVisible"
					:span="19"
					:label="`${t('dalsi')} ${t('schvalovatel', 2).toLowerCase()}`"
					v-model="propsRef.eskalace.value.uzivatelSchvaluje"
					multiple
					filterable
					remote
					reserve-keyword
					:remote-method="schvalovateleRemoteMethod"
					:loading="schvalovateleLoading"
					:options="propsRef.eskalace.value.uzivatelSchvalujeDropDownList"
				/>
			</k-row>
		</k-col>
		<k-col :span="24">
			<k-row class="k-text_area-label">
				<k-form-item v-bind="{ label: t('text') }" class="el-col-24 el-col-xs-24">
					<k-rich-text v-model="propsRef.eskalace.value.text" v-bind="{ references: references, baseUrl, uploadVisible: false }" />
				</k-form-item>
			</k-row>
		</k-col>
		<k-col :span="24">
			<k-row class="k-text_area-label">
				<k-form-item v-bind="{ label: t('komentar') }" class="el-col-24 el-col-xs-24">
					<k-rich-text v-model="propsRef.eskalace.value.komentarText" v-bind="{ references: references, baseUrl, uploadVisible: false }" />
				</k-form-item>
			</k-row>
		</k-col>

		<el-descriptions>
			<el-descriptions-item :span="24" :label="`${t('vytvoril')}:`">{{ user?.zobrazeneJmeno }}</el-descriptions-item>
			<!-- <el-descriptions-item :span="24" label="Prilohy:">
					{{ data.prilohy.value.join(', ') }}
				</el-descriptions-item> -->
		</el-descriptions>
	</k-row>
</template>

<script setup lang="ts">
import { useAuthorization } from '@/template/account/authorization/provider';
import type { Priloha } from '@/views/prilohy/type';
import { prilohyUrl } from '@/views/vozidlo/constants';
import { computed, toRefs, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { EnumEskalaceDialogType } from '../constants';
import { eskalace, useEskalace } from '../provider';
import type { Eskalace, SkupinaDropDown } from '../type';
import { useStore as useCacheStore } from '@/template/cache';
import _ from 'lodash';

export interface Props {
	vozidloId: number;
	eskalace: Eskalace;
	references: Priloha[];
	type: EnumEskalaceDialogType;
	uzivatelSkupinaList: SkupinaDropDown[];
	prirazenaSkupinaUzivateluId: number | null;
	uzivatelPrirazeno: string[] | null;
}

const props = withDefaults(defineProps<Props>(), { prirazenaSkupinaUzivateluId: null, uzivatelPrirazeno: null });
const propsRef = toRefs(props);
const { t } = useI18n();
const cacheStore = useCacheStore();
const emits = defineEmits(['update:prirazenaSkupinaUzivateluId', 'update:uzivatelPrirazeno']);

const { user } = useAuthorization();

const options = computed(() => ({ type: propsRef.type.value }));

const { predaniLoading, predaniRemoteMethod, schvalovateleLoading, schvalovateleRemoteMethod, priradeniSkupinaList, schvalovateleSkupinaList } = useEskalace(
	propsRef.eskalace,
	propsRef.uzivatelSkupinaList,
	options,
);

const schvalovatelVisible = computed(() => propsRef.type.value === EnumEskalaceDialogType.Vytvoreni);

const baseUrl = computed(() => {
	return `${prilohyUrl}${props.vozidloId}`;
});

const kUzavreni = computed(() => propsRef.type.value === EnumEskalaceDialogType.KUzavreniu);
</script>

<style scoped></style>
