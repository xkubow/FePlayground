<template>
	<k-layout-edit v-bind="{ leaving }" v-on="{ ...layoutListeners }">
		<template #title> {{ t(NAME) }} </template>
		<template #actions />
		<k-card row>
			<k-input v-model="stitekKod" label-key="stitekKod" />
			<k-input v-model="text" label-key="text" />
			<k-table-frame v-bind="{ totalCount: tables.prCislo.totalCount }">
				<template #header>
					<span class="pr-10">{{ t('prCislo', 2) }}</span>
					<k-button @click="openSelect">
						<k-icon><PlusIcon /></k-icon>
					</k-button>
				</template>
				<k-table v-bind="{ ...tables.prCislo, objectName: NAME_PR_CISLO, tableName: tables.prCislo.name }" @row-delete="rowDelete" />
			</k-table-frame>
		</k-card>
	</k-layout-edit>
</template>

<script lang="ts">
import { Entity } from '@/template/page/@types/page';
import { editName } from '@/template/page/constants';
import { init } from '@/template/page/providers/edit';
import { mapValues } from '@/template/page/providers/store_v2';
import { openSelectList } from '@/template/router/path';
import { isNotNull } from '@/template/utils/typeCheck';
import { NAME as NAME_PR_CISLO } from '@/views/ciselniky/prCislo/constants';
import { apiProvider as vozidloStitekApiProvider } from '@/views/vozidloStitek/api/vozidloStitekPrCislo';
import { Plus as PlusIcon } from '@element-plus/icons-vue';
import { defineComponent, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PrCislo } from '../ciselniky/prCislo/types';
import { NAME } from './constants';
import { local, props as storeProps, server, tables, useStore } from './store/edit';

export default defineComponent({
	name: editName(NAME),
	components: { PlusIcon },
	setup(props) {
		const store = useStore();
		const { t } = useI18n();

		const edit = init(NAME, store, props, { reload, parseId: (id) => Number.parseInt(id as string) });
		const mapedLast = !store.last
			? toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local })
			: {
					...mapValues(store.entityDefault.serverData, store, 'serverData'),
					...mapValues(store.entityDefault.localData, store, 'localData'),
					...mapValues(store.entityDefault, store),
			  };

		const prCisloLoading = ref(false);
		function prCisloRemoteMethod(query: string) {
			try {
				prCisloLoading.value = true;
			} finally {
				prCisloLoading.value = false;
			}
		}

		async function openSelect() {
			if (!mapedLast.id.value) {
				await edit.changeToEdit();
			}
			openSelectList(NAME_PR_CISLO, { vozidloStitekId: mapedLast.id.value });
		}
		async function rowDelete(row: PrCislo) {
			isNotNull(mapedLast.id.value);
			await vozidloStitekApiProvider.deleteCrossEntity(mapedLast.id.value?.toString(), row.prCisloKod);
			reload();
		}

		function reload() {
			edit.loadRows({ tableName: tables.prCislo.name });
		}

		return {
			...mapedLast,
			...edit,
			t,
			NAME,
			NAME_PR_CISLO,
			prCisloLoading,
			prCisloRemoteMethod,
			openSelect,
			rowDelete,
		};
	},
});
</script>

<style scoped></style>
