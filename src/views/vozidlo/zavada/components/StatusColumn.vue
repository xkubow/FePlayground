<template>
	<k-table-column :key="column.id" v-bind="{ labelKey: column.i18nKey, column, nextSortIndex: 0 }">
		<template #default="{ row }">
			<zavada-status-cell :status="row.opravenoDatum" />
		</template>
	</k-table-column>
</template>

<script setup lang="ts">
import type { Column } from '@/template/components/table/@types/table';
import KTableColumn from '@/template/components/table/TableColumn.vue';
import ZavadaStatusCell from './StatusCell.vue';

defineProps({
	column: { type: Object as () => Column },
});
</script>

<style scoped></style>
