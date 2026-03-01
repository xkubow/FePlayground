<template>
	<k-table-column>
		<template #default="{ row }">
			<k-row class="jc-c ai-c">
				<k-col :span="14">
					<span v-if="!row.editIbn" class="pr-10">{{ row.ibnNazev }}</span>
					<k-input v-else v-bind="{ labelKey: 'Nazev', wrapp: false }" size="small" v-model="row.ibnNazev" wrappClass="w-100" />
				</k-col>
				<k-col :span="10" v-if="row.vyrobniLinkaKontrolniBodId && editable">
					<k-row class="jc-fe">
						<el-icon v-if="!row.editIbn" class="cursor-p mr-10" :size="17" @click.stop="$emit('insertPracoviste', row)"><plus-icon /></el-icon>
						<el-icon v-if="!row.editIbn" class="cursor-p mr-10" :size="17" @click.stop="edit(row)"><edit-icon /></el-icon>
						<el-icon v-if="!row.editIbn" class="cursor-p" :size="17" @click.stop="remove(row)"><minus-icon /></el-icon>
						<el-icon v-if="row.editIbn" class="cursor-p mr-10" :size="17" @click.stop="save(row)"><finished-icon /></el-icon>
						<el-icon v-if="row.editIbn" class="cursor-p" :size="17" @click.stop="cancel(row)"><close-icon /></el-icon>
					</k-row>
				</k-col>
			</k-row>
		</template>
	</k-table-column>
</template>

<script setup lang="ts">
import type { Row } from '@/template/components/table/@types/table';
import { Close as CloseIcon, Edit as EditIcon, Finished as FinishedIcon, Minus as MinusIcon, Plus as PlusIcon } from '@element-plus/icons-vue';
import type { RowKonfigurace } from '../../tables';
import { apiProvider } from '../api';

export interface Props {
	editable: boolean;
}

defineProps<Props>();

const emits = defineEmits(['insertPracoviste', 'loadRows']);

function edit(row: Row<RowKonfigurace>) {
	row.editIbn = true;
}
function cancel(row: Row<RowKonfigurace>) {
	row.editIbn = false;
	emits('loadRows');
}
async function save(row: Row<RowKonfigurace>) {
	row.editIbn = false;
	const payload = {
		id: row.vyrobniLinkaKontrolniBodId,
		poradi: row.poradi,
		ibnNazev: row.ibnNazev,
		repaseKontrolniBodId: row.repaseKontrolniBodId,
		zobrazitNaSemaforu: row.zobrazitNaSemaforu,
	};
	try {
		await apiProvider.updateEntity(row.vyrobniLinkaKontrolniBodId, payload);
	} finally {
		emits('loadRows');
	}
}
async function remove(row: Row<RowKonfigurace>) {
	try {
		await apiProvider.deleteEntity(row.vyrobniLinkaKontrolniBodId);
	} finally {
		emits('loadRows');
	}
}
</script>

<style scoped></style>
