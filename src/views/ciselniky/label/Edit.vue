<template>
	<k-layout-edit v-bind="{ leaving, canDelete: false }" v-on="{ ...layoutListeners }">
		<template #title> {{ t(NAME) }} </template>
		<template #actions />
		<k-card row>
			<k-input v-model="text" label-key="text" />
		</k-card>
	</k-layout-edit>
</template>

<script lang="ts">
import { Entity } from '@/template/page/@types/page';
import { PageMode, editName } from '@/template/page/constants';
import { init } from '@/template/page/providers/edit';
import { mapValues } from '@/template/page/providers/store_v2';
import { defineComponent, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { NAME } from './constants';
import { NAME as MODELOVA_TRIDA_NAME } from '@/views/ciselniky/modelovaTrida/constants';
import { NAME as MODELOVA_SKUPINA_NAME } from '@/views/ciselniky/modelovaSkupina/constants';
import { NAME as RIDICI_JEDNOTKA_NAME } from '@/views/ciselniky/ridiciJednotka/constants';
import { local, props as storeProps, server, tables, useStore } from './store/edit';
import { useRoute } from 'vue-router';

export default defineComponent({
	name: editName(NAME),
	setup() {
		const store = useStore();
		const { t } = useI18n();
		const route = useRoute();

		var routeName = route.name as string;
		var pageTypName = routeName.replace('label', '').replace(PageMode.EDIT, '').replace(PageMode.CREATE, '');

		const edit = init(NAME, store);
		const mapedLast = !store.last
			? toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local })
			: {
					...mapValues(store.entityDefault.serverData, store, 'serverData'),
					...mapValues(store.entityDefault.localData, store, 'localData'),
					...mapValues(store.entityDefault, store),
			  };

		if (pageTypName === MODELOVA_TRIDA_NAME) mapedLast.modelovaTridaKod.value = route.params.kod as string;
		if (pageTypName === MODELOVA_SKUPINA_NAME) mapedLast.modelovaSkupinaKod.value = route.params.kod as string;
		if (pageTypName === RIDICI_JEDNOTKA_NAME) mapedLast.ridiciJednotkaId.value = parseInt(route.params.kod as string);

		return {
			...mapedLast,
			...edit,
			t,
			NAME,
		};
	},
});
</script>

<style scoped></style>
