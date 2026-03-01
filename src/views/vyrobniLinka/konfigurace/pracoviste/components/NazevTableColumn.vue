<template>
	<k-table-column>
		<template #default="{ row }">
			<k-row class="jc-sb ai-c">
				<k-col :span="14">
					<span v-if="!row.editPracoviste" class="pr-10">{{ row.vyrobniLinkaPracovisteUpsNazev }}</span>
					<k-input v-else v-bind="{ labelKey: 'nazev', wrapp: false }" size="small" v-model="row.vyrobniLinkaPracovisteUpsNazev" wrappClass="w-100" />
				</k-col>
				<k-col :span="10" v-if="row.vyrobniLinkaPracovisteId && editable" class="d-f jc-fe">
					<el-icon v-if="!row.editPracoviste" class="cursor-p mr-10" :size="17" @click.stop="edit(row)"><edit-icon /></el-icon>
					<el-icon v-if="!row.editPracoviste" class="cursor-p" :size="17" @click.stop="remove(row)"><minus-icon /></el-icon>
					<el-icon v-if="row.editPracoviste" class="cursor-p mr-10" :size="17" @click.stop="save(row)"><finished-icon /></el-icon>
					<el-icon v-if="row.editPracoviste" class="cursor-p" :size="17" @click.stop="cancel(row)"><close-icon /></el-icon>
				</k-col>
				<k-col :span="10" v-if="row.vyrobniLinkaPracovisteId && subEdit && !editable" class="d-f jc-fe">
					<el-icon v-if="!row.editPracoviste" class="cursor-p mr-10" :size="17" @click.stop="edit(row)"><edit-icon /></el-icon>
					<el-icon v-if="row.editPracoviste" class="cursor-p mr-10" :size="17" @click.stop="save(row)"><finished-icon /></el-icon>
					<el-icon v-if="row.editPracoviste" class="cursor-p" :size="17" @click.stop="cancel(row)"><close-icon /></el-icon>
				</k-col>
			</k-row>
		</template>
	</k-table-column>
</template>

<script setup lang="ts">
import type { Row } from '@/template/components/table/@types/table';
import { Close as CloseIcon, Edit as EditIcon, Finished as FinishedIcon, Minus as MinusIcon } from '@element-plus/icons-vue';
import type { RowKonfigurace } from '../../tables';
import { apiProvider } from '../api';

export interface Props {
	editable: boolean;
	subEdit: boolean;
}

defineProps<Props>();

const emits = defineEmits(['loadRows']);

function edit(row: Row<RowKonfigurace>) {
	row.editPracoviste = true;
}

function cancel(row: Row<RowKonfigurace>) {
	row.editPracoviste = false;
	emits('loadRows');
}

async function save(row: Row<RowKonfigurace>) {
	const payload = {
		id: row.vyrobniLinkaPracovisteArcId ?? row.vyrobniLinkaPracovisteId,
		vyrobniLinkaKontrolniBodId: row.vyrobniLinkaKontrolniBodId,
		vyrobniLinkaSegmentId: row.vyrobniLinkaSegmentId,
		upsNazev: row.vyrobniLinkaPracovisteUpsNazev,
		sqsId: row.vyrobniLinkaPracovisteSqsId,
		cislo: row.cislo,
	};
	try {
		if (row.vyrobniLinkaPracovisteArcId !== null) await apiProvider.updateArchEntity(row.vyrobniLinkaPracovisteArcId, payload);
		else await apiProvider.updateEntity(row.vyrobniLinkaPracovisteId, payload);
	} finally {
		emits('loadRows');
	}
}
async function remove(row: Row<RowKonfigurace>) {
	try {
		await apiProvider.deleteEntity(row.vyrobniLinkaPracovisteId);
	} finally {
		emits('loadRows');
	}
}
</script>

<style scoped></style>
