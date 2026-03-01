<template>
	<k-layout-list ref="listLayout" v-bind="{ operations: table?.operations, leaving }" v-on="layoutListyeners">
		<template #title> {{ t(MENU) }} </template>
		<template #filter>
			<k-input label-key="oddeleni" v-model="oddeleni" />
			<k-select label-key="vyrobniLinka" v-model="vyrobniLinkaId" :options="dropDownList.vyrobniLinka" />
			<k-check-box-3state label-key="station" v-model="station" />
			<k-input label-key="zobrazeneJmeno" v-model="zobrazeneJmeno" />
			<k-input :label="`${t('Zkusenost')} ${t('od')}`" v-model="zkusenost.od" :span="12" />
			<k-input :label="`${t('Zkusenost')} ${t('do')}`" v-model="zkusenost.do" :span="12" />
			<k-input label-key="DZC" v-model="dzc" uppercase />
			<k-input label-key="MfaPerNr" v-model="mfaPerNr" />
		</template>
		<template #content>
			<k-table-frame v-bind="{ paging: tableBinds.paging, totalCount: tableBinds.totalCount }" v-model.paging="tableBinds.paging" v-on="tableEvents">
				<k-table
					ref="mtable"
					v-bind="{ maxHeight, ...tableBinds, extraButtons }"
					v-on="{ ...tableEvents, rowAddTo }"
					v-model:columns="tableBinds.columns"
					v-model.paging="tableBinds.paging"
				/>
			</k-table-frame>
		</template>
	</k-layout-list>
</template>

<script lang="ts">
import { useStore as useCacheStore } from '@/template/cache';
import type { Row } from '@/template/components/table/@types/table';
import { Entity } from '@/template/page/@types/page';
import { editName, listName } from '@/template/page/constants';
import { init } from '@/template/page/providers/list';
import { generateComputed } from '@/template/page/providers/store';
import { useStore as usePageManagerStore } from '@/template/store/pageManager';
import { storeToRefs } from 'pinia';
import { defineComponent, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiProvider } from './api';
import { MENU, NAME } from './constants';
import { NAME as SKUPINA_NAME } from './skupina/constants';
import { local, props as storeProps, server, tables, useStore } from './store/list';
import type { Uzivatel } from './type';
import { useUzivatel } from './provider';
import { selectButton } from '@/template/components/table/tableOperations';
import type { UnknownObject } from '@/template/@types/kTemplate';

export default defineComponent({
	name: listName(NAME),
	props: {
		skupinaUzivateluId: String,
	},
	setup(props) {
		const pageMgrStore = usePageManagerStore();
		const store = useStore();
		const cacheStore = useCacheStore();
		const { t } = useI18n();

		const cache = storeToRefs(cacheStore);
		const list = init(NAME, store, props);
		const mapedLast = store.last ? generateComputed(store.last) : toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local });

		const extraButtons = [{ ...selectButton(selectRowClick), isVisible: () => pageMgrStore.previous?.name === editName(SKUPINA_NAME) }];

		function selectRowClick(e: Event, row: Row<UnknownObject>) {
			e.stopPropagation();
			rowAddTo(row as Uzivatel);
		}

		async function rowAddTo(row: Row<Uzivatel>) {
			const previousPage = pageMgrStore.previous;
			switch (previousPage?.name) {
				case editName(SKUPINA_NAME):
					mapedLast.props.value.skupinaUzivateluId && (await apiProvider.addUizvatelToskupina({ id2: row.id, id1: mapedLast.props.value.skupinaUzivateluId }));
					list.loadRows();
					break;
			}
		}

		const uzivatelProvider = useUzivatel({
			filter: { selectedId: mapedLast.id, filteredList: mapedLast.uzivatelIdList },
		});

		return {
			mapedLast,
			...list,
			...mapedLast,
			...cache,
			MENU,
			t,
			rowAddTo,
			uzivatelProvider,
			extraButtons,
		};
	},
});
</script>

<style scoped></style>
