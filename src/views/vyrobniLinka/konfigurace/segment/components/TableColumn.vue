<template>
	<k-table-column v-bind="{ tableName, labelKey: column.i18nKey, column, prop: `${column.id}` }">
		<template #header>
			<k-table-column-header v-bind="{ column, labelKey: `tables.${tableName}.${column.i18nKey}` }">
				<template #actions>
					<el-icon v-if="editable" class="cursor-p mr-10" :size="17" @click.stop="$emit('insert')"><edit-icon /></el-icon>
				</template>
			</k-table-column-header>
		</template>
		<nazev-table-column
			v-bind="{
								tableName,
								labelKey: column.columns![0].i18nKey,
								column: column.columns![0],
								prop: `${column.columns![0].id}`,
								editable,
							}"
			@loadRows="$emit('loadRows')"
		/>
		<ups-nazev-table-column v-bind="{ tableName, labelKey: column.columns![1].i18nKey, column: column.columns![1], prop: `${column.columns![1].id}` }" />
	</k-table-column>
</template>

<script setup lang="ts">
import type { Column } from '@/template/components/table/@types/table';
import { Edit as EditIcon } from '@element-plus/icons-vue';
import NazevTableColumn from './NazevTableColumn.vue';
import UpsNazevTableColumn from './UpsNazevTableColumn.vue';

export interface Props {
	tableName: string;
	column: Column;
	editable: boolean;
}

defineProps<Props>();

defineEmits(['insert', 'insertPracoviste', 'loadRows', 'update:edit']);
</script>

<style scoped></style>
