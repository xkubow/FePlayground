<template>
	<k-table-column v-bind="{ tableName, labelKey: column.i18nKey, column, prop: `${column.id}` }">
		<nazev-table-column
			v-bind="{
								tableName,
								labelKey: column.columns![0].i18nKey,
								column: column.columns![0],
								prop: `${column.columns![0].id}`,
								editable, subEdit
							}"
			v-on="{ loadRows: () => $emit('loadRows') }"
		/>
		<sqs-table-column v-bind="{ tableName, labelKey: column.columns![1].i18nKey, column: column.columns![1], prop: `${column.columns![1].id}` }" />
		<cislo-table-column v-bind="{ tableName, labelKey: column.columns![2].i18nKey, column: column.columns![2], prop: `${column.columns![2].id}` }" />
	</k-table-column>
</template>

<script setup lang="ts">
import type { Column } from '@/template/components/table/@types/table';
import CisloTableColumn from './CisloTableColumn.vue';
import NazevTableColumn from './NazevTableColumn.vue';
import SqsTableColumn from './SqsTableColumn.vue';

export interface Props {
	tableName: string;
	column: Column;
	editable: boolean;
	subEdit: boolean;
}

defineProps<Props>();

defineEmits(['insert', 'insertPracoviste', 'loadRows', 'update:edit']);
</script>

<style scoped></style>
