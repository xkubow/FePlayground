<template>
	<k-layout-edit v-bind="{ leaving }" v-on="{ ...layoutListeners }">
		<template #title> {{ t(MENU) }} </template>
		<template #actions />
		<k-card row>
			<k-input v-model="text" label-key="text" />
			<k-input v-model="poznamka" label-key="poznamka" />
		</k-card>
	</k-layout-edit>
</template>

<script lang="ts">
import { Entity } from '@/template/page/@types/page';
import { editName, PageMode } from '@/template/page/constants';
import { init } from '@/template/page/providers/edit';
import { mapValues } from '@/template/page/providers/store_v2';
import { defineComponent, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { NAME, MENU } from './constants';
import { local, props as storeProps, server, tables, useStore } from './store/edit';

export default defineComponent({
	name: editName(NAME),
	setup() {
		const store = useStore();
		const { t } = useI18n();

		const edit = init(NAME, store);
		const mapedLast = !store.last
			? toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local })
			: {
				...mapValues(store.entityDefault.serverData, store, 'serverData'),
				...mapValues(store.entityDefault.localData, store, 'localData'),
				...mapValues(store.entityDefault, store),
			};


		return {
			...mapedLast,
			...edit,
			t,
			MENU,
		};
	},
});
</script>

<style scoped></style>
