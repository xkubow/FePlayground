<template>
	<k-layout-edit data-testid="zavada-form" v-bind="{ leaving, model: mappedLast, rules }"
		v-on="{ ...layoutListeners }" ref="layoutRef">
		<template #title> {{ `${t('vozidloZavada')}` }} {{ isMobile ? `` : ` (${maskedKnr})` }}</template>
		<span v-if="isMobile" class="ml-10 df title sub-title">{{ maskedKnr }}</span>
		<k-tabs v-model="activeTabName">
			<el-tab-pane :label="t('hlavniUdaje')" name="HlavniUdaje">
				<!-- <k-row v-if="isCreateMode">
					<k-input-number label-key="dobaOpravyMinuty" v-model="dobaOpravyMinuty" />
				</k-row> -->
				<k-row>
					<k-col :span="10">
						<div>
							<k-svg-check-box v-model="opravene" :disabled="isOpravenoDisabled">
								<span class="status" :style="statusColor">{{ `${opravene ? '' : 'NE'}OPRAVENO` }}</span>
								<span class="ml-10">{{ `${opravenoDatum?.toLocaleString(actualLocale) ?? ''}` }}</span>
							</k-svg-check-box>
						</div>
						<div>
							<k-svg-check-box v-model="odeslanoDoSqsDatumCheck" :disabled="true" :size="20">
								<span :style="odeslanoDoSqsStatusColor">{{ `${odeslanoDoSqsDatumCheck ? '' :
									'NE'}ODESLANO do
									SQS` }}</span>
								<span class="ml-10">{{ `${odeslanoDoSqsDatum?.toLocaleString(actualLocale) ?? ''}`
								}}</span>
								<k-button v-if="!odeslanoDoSqsDatumCheck && canCreate" @click="odesliDoSqs"
									class="ml-10" label-key="odeslatSQS" />
							</k-svg-check-box>
						</div>
					</k-col>
					<k-col :span="14">
						<CasOpravyFrame v-if="isCreateMode"
							v-bind="{ dobaOpravyMinuty, intervalOpravy, text: casOpravyText, required: isCreateMode }"
							@update:dobaOpravyMinuty="updateDobaOpravyMinuty" @update:text="updateCasOpravyText"
							@update:intervalOpravy="updateIntervalOpravy" />
						<k-row>
							<k-select :span="3" label-key="kategorie" v-model="sqsZavadaKategorieId"
								:options="dropDownList.sqsZavadaKategorie" @change="sqsZavadaKategorieChange"
								:disabled="isFromNavrhovane || isViewMode" />
							<k-select :span="5" label-key="skupina" v-model="sqsZavadaSkupinaId" filterable
								:options="sqsZavadaSkupinaFiltered" @change="sqsZavadaSkupinaChange"
								:disabled="isFromNavrhovane || !sqsZavadaKategorieId || isViewMode" />
							<k-select :span="10" label-key="mistoNaVoze" v-model="sqsZavadaRadekId"
								:options="sqsZavadaRadekFiltered"
								:disabled="isFromNavrhovane || !sqsZavadaSkupinaId || isViewMode" filterable />
							<k-select :span="6" label-key="typ" v-model="sqsZavadaTypId"
								:options="dropDownList.sqsZavadaTyp" filterable autocapitalize="off" autocomplete="off"
								spellcheck="false" autocorrect="off" />
							<k-select :span="6" label-key="vinik" v-model="sqsZavadaVinikId"
								:options="dropDownList.sqsZavadaVinik" filterable />
							<k-select :span="6" label-key="mistoVznikuZavady" v-model="pracovisteVznikuZavadyArcId"
								filterable show-more :options="dropDownLists.pracovisteVznikuZavady" />
							<k-select :span="6" label-key="mistoZadaniZavady" v-model="pracovisteZadaniZavadyArcId"
								filterable show-more :options="dropDownLists.pracovisteZadaniZavady"
								@change="pracovisteChange" />
						</k-row>
					</k-col>
					<k-input :disabled="isViewMode" label-key="text" :span="10" v-model="text"
						:autosize="{ minRows: 2, maxRows: 4 }" type="textarea" />
					<k-input :disabled="!isCreateMode" label-key="navrhovaneReseni" :span="14" v-model="zpusobOpravy"
						:autosize="{ minRows: 2, maxRows: 4 }" type="textarea" />
					<k-col>
						<table-chyby :rows="tables.chyby.rows" :columns="tables.chyby.columns"
							:rjInfopRows="tables.ridiciJednotkaInfo.rows" @detail-select.once="detailSelect" />
					</k-col>
					<k-table-frame label-key="navrhovaneZavady">
						<NavrhovaneZavadyVue
							v-bind="{ rows: tables.navrhovane.rows, disabled: true, selectable: true }" />
					</k-table-frame>
					<k-col>
						<CasOpravy v-if="!isCreateMode && id"
							v-bind="{ casOpravy: tables.casOpravy, vozidloZavadaId: parseInt(id.toString()), showSummary: true, knr }"
							@refresh="refreshCasOpravy" />
					</k-col>
				</k-row>
			</el-tab-pane>
		</k-tabs>
	</k-layout-edit>
</template>

<script lang="ts">
import { DB_SYS_DATE } from '@/template';
import { useStore as useAuthorizationStore } from '@/template/account/authorization/store';
import { useStore as useCacheStore } from '@/template/cache';
import type { Row } from '@/template/components/table/@types/table';
import { editName } from '@/template/page/constants';
import { init } from '@/template/page/providers/edit';
import { mapValues } from '@/template/page/providers/store_v2';
import { useStore as usePageManagerStore } from '@/template/store/pageManager';
import { actualLocale } from '@/template/utils/date';
import { UserOperationFlags } from '@/template/utils/operationFlags';
import TableChyby from '@/views/chyby/components/TableChyby.vue';
import type { Detail } from '@/views/chyby/type';
import _ from 'lodash';
import { storeToRefs } from 'pinia';
import { computed, defineComponent, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { NAME_CAS_OPRAVY, NAME as NAME_VOZIDLO } from '../constants';
import { maskKnr } from '../provider';
import { useStore as useStoreVozidloEdit } from '../store/edit';
import { apiProvider } from './api';
import { NAME } from './constants';
import { useStore } from './store/edit';
import NavrhovaneZavadyVue from './navrhovane/components/NavrhovaneZavady.vue';
import CasOpravyFrame from '../components/CasOpravyFrame.vue';
import { apiProviderCasOpravy } from '../api';
import CasOpravy from '../components/CasOpravy.vue';
import type { Interval } from '@/template/components/@types';

export default defineComponent({
	name: editName(NAME),
	components: {
		TableChyby,
		NavrhovaneZavadyVue,
		CasOpravyFrame,
		CasOpravy,
	},
	setup(props) {
		const store = useStore();
		const cacheStore = useCacheStore();
		const pageManagerStore = usePageManagerStore();
		const { isMobile, user } = useAuthorizationStore();
		const cache = storeToRefs(cacheStore);
		const { t } = useI18n();
		const layoutRef = ref<{
			validate: (...a: any[]) => Promise<boolean>
			validateField: (...a: any[]) => Promise<void>
			clearValidate: (...a: any[]) => void
			resetFields: (...a: any[]) => void
			getForm: () => any
		} | null>(null);

		async function beforeSave(id?: string) {
			const chyby = store.last?.tables.chyby.rows.filter((c) => c.detail.some((d) => !!d.updateStatus));
			store.last && chyby && (store.last.serverData.chyby = chyby);
			const isValid = await layoutRef?.value?.validate()
			return isValid;
		}
		function cleanupElementPlusPoppers() {
			// close/remove any lingering popper/dropdown DOM
			document
				.querySelectorAll(
					".el-popper, .el-select__popper, .el-select-dropdown, .el-tooltip__popper, .el-popover"
				)
				.forEach((n) => n.remove());

			// also remove any stray aria controls that can keep references
			document
				.querySelectorAll("[aria-controls^='el-id-']")
				.forEach((n) => n.removeAttribute("aria-controls"));
		}


		const afterSave = async (id?: string) => {
			if (edit.isCreateMode.value)
				await apiProviderCasOpravy.createEntity({
					uzivatelId: user?.uzivatelId,
					knr: mappedLast.knr.value,
					vozidloZavadaId: parseInt(id!),
					casZacatek: mappedLast.intervalOpravy.value.od,
					dobaOpravyMinuty: mappedLast.dobaOpravyMinuty.value,
					text: mappedLast.casOpravyText.value
				});
			return true;
		}

		const edit = init(NAME, store, props, {
			beforeSave,
			afterSave,
			loadTables,
			propMapper(v: unknown, k: string) {
				switch (k) {
					case 'isFromNavrhovane':
						return !!v;
					case 'knr':
						return v ? Number(v as string) : null;
					default:
						return v;
				}
			},
		});

		const mappedLast = {
			...mapValues(store.entityDefault.serverData, store, 'serverData'),
			...mapValues(store.entityDefault.localData, store, 'localData'),
			...mapValues(store.entityDefault, store),
		};

		onMounted(() => {

			// cleanupElementPlusPoppers();
			// // Automatically go back after 2 seconds
			// setTimeout(() => {
			// 	edit.layoutListeners.closeClick()
			// }, 2000);
		});
		onUnmounted(() => {
			console.log("ZAVADA unmount");
			cleanupElementPlusPoppers();
		});

		const canCreate = computed(() => (mappedLast.operations.value ?? 0) & UserOperationFlags.CREATE);

		function loadTables(filter: Record<string, unknown> | undefined, tablesToFetch: string[] | undefined) {
			if (edit.isCreateMode.value) {
				tablesToFetch = tablesToFetch?.filter((p) => mappedLast.isFromNavrhovane.value ? p !== NAME_CAS_OPRAVY : p !== 'navrhovane' && p !== NAME_CAS_OPRAVY)
			}

			edit.fetchTableData({ filter, tablesToFetch });
		}


		const opravene = computed({
			get() {
				return !!mappedLast.opravenoDatum.value;
			},
			set(val: boolean) {
				mappedLast.opravenoDatum.value = val ? DB_SYS_DATE : null;
			},
		});

		const maskedKnr = computed(() => maskKnr(mappedLast.knr.value?.toString()));

		const odeslanoDoSqsDatumCheck = computed(() => !_.isNil(mappedLast.odeslanoDoSqsDatum.value));

		const statusColor = computed(() => {
			return {
				color: opravene.value ? 'green' : 'red',
			};
		});
		const odeslanoDoSqsStatusColor = computed(() => {
			return {
				color: odeslanoDoSqsDatumCheck.value ? 'green' : 'red',
			};
		});

		onBeforeMount(() => {
			mappedLast.activeTabName.value = 'HlavniUdaje';
		});
		onMounted(() => {
			if (edit.isCreateMode) {
				edit.setFromLocalStore();
			}
		});

		onBeforeUnmount(() => {
			if (pageManagerStore.previous?.name === editName(NAME_VOZIDLO)) {
				const storeVozidloEdit = useStoreVozidloEdit();
				storeVozidloEdit.tableData({ tableName: 'zavada' });
			}
		});

		const isOpravenoDisabled = computed(() => {
			return edit.isEditMode.value ? !!mappedLast.opravenoDatum.value : !edit.isCreateMode.value;
		});

		const sqsZavadaSkupinaFiltered = computed(() =>
			mappedLast.sqsZavadaKategorieId.value
				? cache.dropDownList.value.sqsZavadaSkupina.filter((i) => i.sqsZavadaKategorieEnum === mappedLast.sqsZavadaKategorieId.value)
				: cache.dropDownList.value.sqsZavadaSkupina,
		);

		const sqsZavadaRadekFiltered = computed(() =>
			cache.dropDownList.value.sqsZavadaRadek.filter((i) => i.sqsZavadaSkupinaId === mappedLast.sqsZavadaSkupinaId.value),
		);

		function sqsZavadaKategorieChange() {
			mappedLast.sqsZavadaSkupinaId.value = null;
			mappedLast.sqsZavadaRadekId.value = null;
		}

		function sqsZavadaSkupinaChange() {
			mappedLast.sqsZavadaRadekId.value = null;
		}

		function detailSelect(row: Row<Detail>) {
			if (edit.isCreateMode.value && !mappedLast.pracovisteVznikuZavadyArcId.value) {
				mappedLast.pracovisteVznikuZavadyArcId.value = row.pracovisteVznikuZavadyArcId;
			}
		}

		async function odesliDoSqs() {
			const odeslaniSqsResponse = await apiProvider.odesliSqs(edit.entityId.value);
			if (odeslaniSqsResponse && odeslaniSqsResponse.data.odeslanoDoSqsDatum) {
				await edit.refreshPage();
			}
		}

		function pracovisteChange(payload: number) {
			edit.saveToLocalStore({ pracovisteZadaniZavadyArcId: payload });
		}

		function updateDobaOpravyMinuty(val: number) {
			mappedLast.dobaOpravyMinuty.value = val;
		}
		function updateCasOpravyText(val: string) {
			mappedLast.casOpravyText.value = val;
		}

		async function refreshCasOpravy() {
			edit.loadTables({ VozidloZavadaId: mappedLast.id }, [NAME_CAS_OPRAVY]);
		}

		const rules = {
			dobaOpravyMinuty: [
				{ required: true, message: 'Povinne pole', trigger: 'blur' },
				{
					trigger: 'blur',
					validator: (_rule: any, field: any) => {
						if (edit.isCreateMode && field.value === null) {
							return Promise.reject(new Error('Povinne pole'))
						}
						return Promise.resolve()
					},
				},
			],
			intervalOpravy: [
				{ required: true, message: 'Povinne pole', trigger: 'blur' },
				{
					trigger: 'blur',
					validator: (_rule: any, field: any) => {
						if (edit.isCreateMode && (field.value.od === null || field.value.do === null)) {
							return Promise.reject(new Error('Povinne pole'))
						}
						return Promise.resolve()
					},
				},
			],
		}

		function updateIntervalOpravy(val: Interval<Date>) {
			mappedLast.intervalOpravy.value = val;
		}

		return {
			t,
			...mappedLast,
			...edit,
			...cache,
			maskedKnr,
			opravene,
			odeslanoDoSqsDatumCheck,
			statusColor,
			odeslanoDoSqsStatusColor,
			isOpravenoDisabled,
			sqsZavadaSkupinaFiltered,
			sqsZavadaRadekFiltered,
			sqsZavadaKategorieChange,
			sqsZavadaSkupinaChange,
			detailSelect,
			actualLocale,
			odesliDoSqs,
			pracovisteChange,
			isMobile,
			canCreate,
			updateDobaOpravyMinuty,
			refreshCasOpravy,
			updateCasOpravyText,
			layoutRef,
			mappedLast,
			rules,
			updateIntervalOpravy,
		};
	},
});
</script>

<style scoped>
.knr {
	text-align: start;
	font-size: 30pt;
	color: green;
	font-weight: bold;
}

.big_buttons {
	margin-left: 0px;
	width: 33%;
}

.table_header {
	background-color: green;
}

.status {
	text-align: start;
	font-size: 30pt;
	font-weight: bold;
	color: red;
}
</style>