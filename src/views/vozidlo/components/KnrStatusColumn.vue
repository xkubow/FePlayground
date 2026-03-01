<template>
	<k-table-column :key="column?.id" v-bind="{ labelKey: column?.name, column, nextSortIndex: 0, headerAlign: 'center' }">
		<template v-slot:header>
			<k-table-column-header v-bind="{ label: 'KNR/ Status testu' }" />
		</template>
		<template v-slot:default="scope">
			<knr-status-cell :knr="scope.parent.row.cells[1]" :status="scope.parent.row.cells[2]" />
		</template>
	</k-table-column>
</template>

<script lang="ts">
import type { Column } from '@/template/components/table/@types/table';
import KTableColumn from '@/template/components/table/TableColumn.vue';
import KTableColumnHeader from '@/template/components/table/TableColumnHeader.vue';
import { defineComponent } from 'vue';
import KnrStatusCell from './KnrStatusCell.vue';

export default defineComponent({
	name: 'KnrStatusColumn',
	props: {
		column: { type: Object as () => Column },
	},
	components: {
		KTableColumn,
		KTableColumnHeader,
		KnrStatusCell,
	},
	setup() {
		return {};
	},
});
</script>

<style scoped></style>
