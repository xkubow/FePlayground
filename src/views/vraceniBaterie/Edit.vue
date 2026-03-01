<template>
	<k-layout-edit v-bind="{ leaving }" v-on="{ ...layoutListeners }">
		<template #title> {{ t('baterie') }} </template>
		<template #actions>
			<k-button v-if="vraceniBaterieStatusEnum !== EnumVraceniBaterieStatus.vReseni" plain @click="kReseni">
				{{ t('predaniKReseni') }}
			</k-button>
			<k-button plain v-if="vraceniBaterieStatusEnum === EnumVraceniBaterieStatus.vReseni" @click="uzavreni">
				{{ t('uzavreni') }}
			</k-button>
			<k-button plain v-if="vozidloKnr" @click="openEskalace">
				{{ t('vozidlo') }}
			</k-button>
		</template>
		<k-card>
			<div class="mt-10">
				<k-row :gutter=4>
					<k-col :span=20>
						<div>
							<k-row>
								<k-select :disabled=true :span="6" label-key="Vracenindstatusenum"
									v-model="vraceniBaterieStatusEnum"
									:options="vraceniBaterieStatusEnumDropDownList" />
								<k-select label-key="vyrobniLinka" v-model="vyrobniLinkaId" :options="dropDownList.vyrobniLinka" :span=6 />
							</k-row>
							<k-row>
								<k-input label-key="NdNr" :span="4" v-model="ndNr" uppercase />
								<k-input label-key="bG" :span="4" v-model="bg" uppercase />
								<k-input label-key="fazitId" :span="4" v-model="fazitId" uppercase />
							</k-row>
							<k-row>
								<k-select label-key="vraceniBaterieStav" v-model="vraceniBaterieStav" :options="vraceniBaterieStavList" :span=6 />
								<k-select label-key="typBaterie" v-model="typBaterieId" :options="dropDownList.typBaterie" :span=6 />
							</k-row>
							<k-row>
								<k-input label-key="swVersion" :span="4" v-model="swVersion" :maxlength="4" uppercase />
								<k-input label-key="hwVersion" :span="4" v-model="hwVersion" :maxlength="4" uppercase />
							</k-row>
							<k-row>
								<k-select :span="4" label-key="UzivateleSkupina" v-model="prirazenaSkupinaUzivateluId"
									v-bind="{ optionsValueName: 'id', optionsTextName: 'text' }"
									:options="uzivatelSkupinaList" />
								<k-select :span="10" :label="t('uzivatel', 2)" v-model="uzivatelPrirazeno" multiple
									filterable remote reserve-keyword :remote-method="predaniRemoteMethod"
									:loading="predaniLoading" :options="uzivatelPrirazenoDropDownList" />
								<k-form-item v-bind="{ label: t('text') }" class="el-col-24 el-col-xs-24">
									<k-rich-text label-key="text" v-model="text"
										v-bind="{ references: tables.priloha?.rows ?? [], baseUrl, uploadVisible: false, editable: vraceniBaterieStatusEnum !== EnumVraceniBaterieStatus.uzavreno }" />
								</k-form-item>
							</k-row>
						</div>
						<frame-komentare
							v-bind="{ rows: tables.komentar.rows, references: tables.priloha.rows, entita: NAME, parentId: id }"
							v-on="{ addKomentar, update: updateKomentar, delete: deleteKomentar }" />
					</k-col>
					<k-col :span=4 v-if="tables.priloha?.rows">
						<div>{{ t('Prilohy') }}</div>
						<frame-prilohy v-model="tables.priloha.rows" v-bind="{ entita: NAME, parentId: id }" />
					</k-col>
				</k-row>
			</div>
		</k-card>
	</k-layout-edit>
</template>

<script lang="ts">
import { useStore as useCacheStore } from '@/template/cache';
import { Entity } from '@/template/page/@types/page';
import { createName, editName, PageMode } from '@/template/page/constants';
import { init } from '@/template/page/providers/edit';
import { generateComputed } from '@/template/page/providers/store';
import { useStore as usePageManagerStore } from '@/template/store/pageManager';
import { storeToRefs } from 'pinia';
import { computed, defineComponent, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { EnumVraceniBaterieStatus, NAME } from './constants';
import { local, props as storeProps, server, tables, useStore } from './store/edit';
import { useUzivatelPrirazeno } from '../uzivatel/provider';
import { useI18n } from 'vue-i18n';
import { NAME as PRILOHA_NAME } from '@/views/prilohy/constants';
import { NAME as VOZIDLO_NAME } from '@/views/vozidlo/constants';
import FrameKomentare from '@/views/komentar/components/Frame.vue';
import FramePrilohy from '../prilohy/components/Frame.vue';
import { useVraceniBaterieKomentar } from '../komentar/provider';
import { openEdit, openPage } from '@/template/router/path';

export default defineComponent({
	name: editName(NAME),
	components: {
		FrameKomentare,
		FramePrilohy,
	},
	setup() {
		const router = useRouter();
		const store = useStore();
		const cacheStore = useCacheStore();
		const pageManagerStore = usePageManagerStore();

		const cache = storeToRefs(cacheStore);
		const { t } = useI18n();

		const edit = init(NAME, store);
		const mapedLast = store.last ? generateComputed(store.last) : toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local });

		if (edit.isCreateMode.value) {
			mapedLast.vraceniBaterieStatusEnum.value ??= 1;
			mapedLast.id.value = 0;

		}

		const { predaniLoading, predaniRemoteMethod } = useUzivatelPrirazeno(mapedLast.uzivatelPrirazeno, mapedLast.uzivatelPrirazenoDropDownList);

		const kometarUse = useVraceniBaterieKomentar(edit, mapedLast.id)

		const kReseni = () => { mapedLast.vraceniBaterieStatusEnum.value = EnumVraceniBaterieStatus.vReseni; edit.save(mapedLast.id.value?.toString()!) }
		const uzavreni = () => { mapedLast.vraceniBaterieStatusEnum.value = EnumVraceniBaterieStatus.uzavreno; edit.save(mapedLast.id.value?.toString()!) }
		const prilohyUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/${NAME}/${PRILOHA_NAME}?vraceniBaterieId=`;
		const baseUrl = computed(() => `${prilohyUrl}${mapedLast.id}`);

		async function openEskalace() {
			if (pageManagerStore.previous?.name == 'VozidloEdit')
				await router.back();
			else
				await openEdit(VOZIDLO_NAME, PageMode.EDIT, { id: mapedLast.vozidloKnr.value! });

		}

		return {
			NAME,
			...mapedLast,
			...edit,
			predaniLoading,
			predaniRemoteMethod,
			t,
			...kometarUse,
			EnumVraceniBaterieStatus,
			kReseni,
			uzavreni,
			baseUrl,
			...cache,
			openEskalace,
		};
	},
});
</script>

<style scoped></style>
