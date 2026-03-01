<template>
	<k-layout-edit v-bind="{ leaving }" v-on="{ ...layoutListeners }">
		<template #title> {{ t(MENU) }} </template>
		<template #actions />
		<k-card row>
			<k-input v-model="modelovaTridaKod" label-key="modelovaTridaKod" uppercase />
			<k-table-frame>
				<template #header>
					<span class="pr-10">{{ t('label') }}</span>
					<k-button @click="addLabel">
						<k-icon><PlusIcon /></k-icon>
					</k-button>
				</template>
				<k-table v-bind="{ ...tables.label, tableName: tables.label.name, objectName: `${LABEL_NAME}${NAME}`, rowKey: tables.label.rowKey }" v-on="{ rowDelete }" />
			</k-table-frame>
		</k-card>
	</k-layout-edit>
</template>

<script lang="ts">
import { Entity } from '@/template/page/@types/page';
import { createName, editName, PageMode } from '@/template/page/constants';
import { init } from '@/template/page/providers/edit';
import { mapValues } from '@/template/page/providers/store_v2';
import { openPage } from '@/template/router/path';
import { defineComponent, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { NAME, MENU } from './constants';
import { Plus as PlusIcon } from '@element-plus/icons-vue';
import { NAME as LABEL_NAME } from '@/views/ciselniky/label/constants';
import { local, props as storeProps, server, tables, useStore } from './store/edit';
import { apiProvider as apiProviderLabel } from '../label/api';
import type { Language } from '../label/type';

export default defineComponent({
	name: editName(NAME),
	components: { PlusIcon },
	setup() {
		const store = useStore();
		const { t } = useI18n();

		const reload = () => {
			store.tableData({ tableName: 'label' });
		};

		const edit = init(NAME, store, {}, { reload });
		const mapedLast = !store.last
			? toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local })
			: {
					...mapValues(store.entityDefault.serverData, store, 'serverData'),
					...mapValues(store.entityDefault.localData, store, 'localData'),
					...mapValues(store.entityDefault, store),
			  };

		async function addLabel() {
			if(edit.isCreateMode.value)
				await edit.changeToEdit();
			openPage(createName(`${LABEL_NAME}${NAME}`), PageMode.CREATE, { kod: mapedLast.modelovaTridaKod.value });
		}

		async function rowDelete(row: Language) {
			await apiProviderLabel.deleteEntity(row.id);
			reload();
		}

		return {
			...mapedLast,
			...edit,
			t,
			MENU,
			addLabel,
			LABEL_NAME,
			NAME,
			rowDelete,
		};
	},
});
</script>

<style scoped></style>
