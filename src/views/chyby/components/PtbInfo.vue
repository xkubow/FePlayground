<template>
	<el-popover :teleported="false" trigger="click" :width="650">
		<div style="text-align: right; margin: 0">
			<el-descriptions :column="1" border>
				<template #title>
					<span>{{ t('ridiciJednotkaInfo') }}</span>
				</template>
				<el-descriptions-item v-for="(value, name) in filteredData" :key="name" :label="`${t(name)}: `">{{ value }}</el-descriptions-item>
			</el-descriptions>
		</div>
		<template #reference>
			<el-icon class="cursor-p" :size="15" @click="ptbClicked"><info-filled-icon /></el-icon>
		</template>
	</el-popover>
</template>

<script setup lang="ts">
import { InfoFilled as InfoFilledIcon } from '@element-plus/icons-vue';
import _ from 'lodash';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Row as RjInfo } from '../tables/ridiciJednotka';

export interface Prop {
	rjInfo?: RjInfo;
}

const props = defineProps<Prop>();

const { t } = useI18n();

const filteredData = computed(() => _.omit(props.rjInfo, ['rowNumber', 'testId', 'ridiciJednotkaId']));

function ptbClicked(event: Event) {
	event.stopPropagation();
}
</script>

<style scoped></style>
