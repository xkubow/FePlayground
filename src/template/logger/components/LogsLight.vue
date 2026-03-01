<template>
	<el-dialog v-model="visible" :title="t('appErrors')" width="90%">
		<k-table v-bind="{ ...table, tableName: table.name }">
			<template #type="{ column, nextSortIndex }">
				<k-table-column v-bind="{ column, labelKey: column.i18nKey, tableName: table.name, nextSortIndex }">
					<template #default="{ row }">
						<el-icon v-if="row.type === 1" :size="20" color="#67C23A"><circle-check-filled-icon /></el-icon>
						<el-icon v-else-if="row.type === 2" :size="20" color="#40AEDF"><info-filled-icon /></el-icon>
						<el-icon v-else-if="row.type === 3" :size="20" color="#E6A23C"><warning-filled-icon /></el-icon>
						<el-icon v-else-if="row.type === 4" :size="20" color="red"><circle-close-filled-icon /></el-icon>
						<span v-else></span>
					</template>
				</k-table-column>
			</template>
			<template #httpError="{ column, nextSortIndex }">
				<k-table-column v-bind="{ column, labelKey: column.i18nKey, tableName: table.name, nextSortIndex }">
					<template #default="{ row }">
						<span v-if="row.httpError">{{ row.httpError.request.responseURL }}</span>
						<span v-else-if="row.apiUrl">{{ row.apiUrl }}</span>
					</template>
				</k-table-column>
			</template>
		</k-table>
		<template #footer>
			<el-button size="small" @click="clearErrors">{{ t('zmazChyby') }}</el-button>
			<el-button size="small" type="primary" @click="visible = false">{{ t('ok') }}</el-button>
		</template>
	</el-dialog>

	<el-tooltip :teleported="false" :content="`${t('pocetErrors')} ${errors.length}`" placement="bottom">
		<el-icon @click="showErrors" :size="20" :color="errors.length === 0 ? 'white' : 'red'" class="logger">
			<warning-icon v-if="errors.length === 0" />
			<warning-filled-icon v-else />
		</el-icon>
	</el-tooltip>
</template>

<script setup lang="ts">
import {
	CircleCheckFilled as CircleCheckFilledIcon,
	CircleCloseFilled as CircleCloseFilledIcon,
	InfoFilled as InfoFilledIcon,
	Warning as warningIcon,
	WarningFilled as WarningFilledIcon,
} from '@element-plus/icons-vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '../store';
import { table as tableErrors } from '../table';

const store = useStore();
const { t } = useI18n();
const errors = computed(() => store.list);
const visible = ref(false);
function showErrors() {
	visible.value = true;
}
function clearErrors() {
	store.list = [];
}
const table = computed(() => ({
	...tableErrors,
	rows: store.list,
}));
</script>

<style lang="scss" scoped>
.logger {
	cursor: pointer;
	margin-left: 15px;
}
</style>
