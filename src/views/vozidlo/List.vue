<template>
		<!--<k-layout-list ref="listLayout" v-bind="{ operations: table?.operations, leaving }" v-on="layoutListyeners">-->
	<k-layout-list ref="listLayout" v-bind="{ operations: table?.operations, leaving }" v-on="layoutListyeners">
		<template #title> Seznam vozidel </template>
				<template #filter>
			<k-input-number label-key="knr" v-model="knr" uppercase />
			<k-input label-key="vin" v-model="vin" uppercase />
			<k-select label-key="modelovyKlic" v-model="modelovaTridaKod" multiple filterable default-first-option :options="dropDownList.modelovaTrida">
				<k-option
					v-for="item in dropDownList.modelovaTrida"
					:key="item.value"
					:label="`${item.value} - ${item.text}`"
					:value="item.value"
					:disabled="item.disabled"
				></k-option>
			</k-select>
			<k-select label-key="PrCislo" v-model="prCisloKod" multiple filterable default-first-option :options="dropDownList.prCislo">
				<k-option
					v-for="item in dropDownList.prCislo"
					:key="item.value"
					:label="`${item.value} - ${item.text}`"
					:value="item.value"
					:disabled="item.disabled"
				></k-option>
			</k-select>
			<k-input label-key="NdNr" v-model="ridiciJednotkaNdNr" uppercase />
			<k-input-number label-key="swVersion" v-model="ridiciJednotkaSwVersion" uppercase />
			<k-select label-key="vyrobniLinka" v-model="vyrobniLinkaId" :options="dropDownList.vyrobniLinka" @change="vyrobniLinkaChange" />
			<k-select label-key="segment" v-model="vyrobniLinkaSegmentId" :options="vyrobniLinkaSegmentList" />
			<k-select label-key="pracoviste" v-model="vyrobniLinkaPracovisteId" :options="vyrobniLinkaPracovisteListFiltered" multiple />
			<k-date-interval v-model="testDatum" label-key="testDatum" v-bind="{ type: 'datetime' }" />
			<k-select label-key="statusIo" v-model="statusIoEnum" :options="statusIoList" multiple />
			<k-check-box-3state v-model="vyrazeno" label-key="vyrazeno" />
		</template>
		<template #content>
			<k-table-frame v-bind="{ paging: tableBinds.paging, totalCount: tableBinds.totalCount }" v-model.paging="tableBinds.paging" v-on="tableEvents">
				<k-table v-bind="{ maxHeight, ...tableBinds }" v-on="tableEvents" v-model:columns="tableBinds.columns" v-model.paging="tableBinds.paging">
					<template #knr="{ column, nextSortIndex }">
						<k-table-column
							v-bind="{ column, labelKey: column.i18nKey, tableName: tableBinds.tableName, nextSortIndex }"
							@update:column="updateColumn($event, tableBinds.columns)"
						>
							<template #default="{ row }">
								<span :class="knrColor(row.statusIoEnum)">{{ row.knr }}</span>
							</template>
						</k-table-column>
					</template>
				</k-table>
			</k-table-frame>
		</template>
	</k-layout-list>
</template>

<script lang="ts">
import { useStore as useCacheStore } from '@/template/cache';
import { Entity } from '@/template/page/@types/page';
import { listName, PageMode } from '@/template/page/constants';
import { init } from '@/template/page/providers/list';
import { generateComputed } from '@/template/page/providers/store';
import { openEdit } from '@/template/router/path';
import _ from 'lodash';
import { storeToRefs } from 'pinia';
import { computed, defineComponent, onBeforeMount, toRefs, watch } from 'vue';
import { EnumStatusIo } from '../chyby/constants';
import { NAME } from './constants';
import { local, props as storeProps, server, tables, useStore } from './store/list';

export default defineComponent({
	name: listName(NAME),
	props: {
		filter: String,
	},
	components: {},
	setup(props) {
		const store = useStore();
		const cacheStore = useCacheStore();

		const cache = storeToRefs(cacheStore);
		const list = init(NAME, store, props, { afterDataLoad, loadRowsOnMounted: false });
		const mapedLast = store.last ? generateComputed(store.last) : toRefs({ ...new Entity(server, local, tables, storeProps), ...server, ...local });

		function knrColor(statusIo: EnumStatusIo | null) {
			if (statusIo === null) return undefined;
			return statusIo === EnumStatusIo.neopraveno ? 'knr-neopraveno' : statusIo === EnumStatusIo.opraveno ? 'knr-opraveno' : 'undefined';
		}

		function vyrobniLinkaChange() {
			mapedLast.vyrobniLinkaSegmentId.value = null;
			mapedLast.vyrobniLinkaPracovisteId.value = [];
			store.loadOnLinkaChange();
		}

		onBeforeMount(() => {
			if (!_.isNil(mapedLast.vyrobniLinkaId.value)) store.loadOnLinkaChange();
		});

		watch(mapedLast.vyrobniLinkaId, () => {
			store.loadOnLinkaChange();
		});

		const vyrobniLinkaPracovisteListFiltered = computed(() => {
			return mapedLast.vyrobniLinkaSegmentId.value
				? mapedLast.vyrobniLinkaPracovisteList.value.filter((i) => i.vyrobniLinkaSegmentId === mapedLast.vyrobniLinkaSegmentId.value)
				: mapedLast.vyrobniLinkaPracovisteList.value;
		});

		async function afterDataLoad() {
			const knr: number = parseInt(props.filter ?? '');
			if (!isNaN(knr)) {
				mapedLast.knr.value = knr;
				await list.filterClick();

				if (mapedLast.tables.value.table.rows.length === 1) {
					const row = mapedLast.tables.value.table.rows[0];
					openEdit(NAME, PageMode.EDIT, { id: row.knr });
				}
				return;
			}
			list.filterClick();
		}

		return {
			...list,
			...mapedLast,
			...cache,
			knrColor,
			vyrobniLinkaChange,
			vyrobniLinkaPracovisteListFiltered,
		};
	},
});
</script>

<style scoped>
.knr-opraveno {
	color: var(--clr-test-opraveno);
}
.knr-neopraveno {
	color: var(--clr-test-neopraveno);
}
</style>
