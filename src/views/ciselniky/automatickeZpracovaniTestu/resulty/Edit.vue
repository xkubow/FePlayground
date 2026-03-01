<template>
	<k-layout-edit v-bind="{ leaving, canDelete: false }" v-on="{ ...layoutListeners }">
		<template #title> {{ t(CRUMB_LABEL_KEY) }} </template>
		<template #actions />
		<k-card row>
			<k-input-number label-key="pblKod" :span="2" v-model="pblKod" :maxlength="4" uppercase />
			<k-input label-key="text" :span="14" v-model="text" />
			<k-select label-key="vyrobniLinka" v-model="vyrobniLinkaId" :options="dropDownList.vyrobniLinka" :span="6" />
		</k-card>
	</k-layout-edit>
</template>

<script lang="ts">
import { useStore as useCacheStore } from '@/template/cache';
import { storeToRefs } from 'pinia';
import { Entity } from '@/template/page/@types/page';
import { editName } from '@/template/page/constants';
import { init } from '@/template/page/providers/edit';
import { mapValues } from '@/template/page/providers/store_v2';
import { defineComponent, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { NAME, CRUMB_LABEL_KEY } from './constants';
import { local, props as storeProps, server, tables, useStore } from './store/edit';
import { useRoute } from 'vue-router';

export default defineComponent({
	name: editName(NAME),
	setup() {
		const store = useStore();
		const route = useRoute();
		const { t } = useI18n();
		const cacheStore = useCacheStore();
		const cache = storeToRefs(cacheStore);

		const edit = init(NAME, store, undefined, {
			propsMapper(v, k) {
				if (k in route.params) {
					switch (k) {
						case 'automatickeZpracovaniTestuEnum':
						case 'id':
							return parseInt(route.params[k] as string);
						default:
							return route.params[k];
					}
				}
				return v;
			},
			parseId: (id) => Number.parseInt(id as string),
		});
		const mapedLast = !store.last
			? toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local })
			: {
					...mapValues(store.entityDefault.serverData, store, 'serverData'),
					...mapValues(store.entityDefault.localData, store, 'localData'),
					...mapValues(store.entityDefault, store),
			  };

		return {
			NAME,
			CRUMB_LABEL_KEY,
			...mapedLast,
			...edit,
			...cache,
			t,
		};
	},
});
</script>

<style scoped></style>
