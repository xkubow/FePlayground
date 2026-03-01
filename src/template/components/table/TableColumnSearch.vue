<template>
	<el-popover :teleported="false" placement="bottom" :width="200" trigger="click" :hide-after="0" v-on="{ show }">
		<template #reference>
			<el-icon v-bind="{ size: 15, color }">
				<search-icon />
			</el-icon>
		</template>
		<el-input ref="filterInput" v-model="filterModel" autofocus clearable />
	</el-popover>
</template>

<script setup lang="ts">
import { Search as SearchIcon } from '@element-plus/icons-vue';
import type ElInput from 'element-plus/lib/components/input';
import { computed, nextTick, ref, toRefs } from 'vue';

export interface Props {
	filter?: string;
}

const emits = defineEmits(['update:filter']);
const props = defineProps<Props>();
const { filter } = toRefs(props);
const filterInput = ref<typeof ElInput | null>(null);

const filterModel = computed({
	get() {
		return filter?.value;
	},
	set(val: string | undefined) {
				let filter = val?.trim();
		filter === '' && (filter = undefined);
		emits('update:filter', val);
	},
});

const color = computed(() => {
	return (filterModel.value?.length ?? 0) > 0 ? 'blue' : undefined;
});

function show() {
	nextTick(() => {
		filterInput.value?.focus();
	});
}
</script>

<style scoped>
i:hover {
	cursor: pointer;
	color: var(--el-color-primary);
}
</style>
