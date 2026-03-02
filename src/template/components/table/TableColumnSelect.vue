<template>
	<k-table-column v-bind="{ width }">
		<template #header>
			<el-checkbox v-model="selectAllModel" :disabled="disabled" :indeterminate="indeterminate"></el-checkbox>
		</template>
		<template #default="scope">
			<el-checkbox
				:size="'small'"
				:disabled="disabled"
				v-model="scope.row.selected"
				:indeterminate="scope.row.selected === null"
				@click="clicked"
				@change="$emit('selectChange', { checked: $event, row: scope.row })"
			/>
			<slot name="suffix" :row="scope.row" />
			<!-- <el-icon style="margin-left: 7px" v-if="scope.parent.row.cells[13]"><connection-icon /></el-icon>
			<el-icon style="margin-left: 7px" v-if="scope.parent.row.cells[14]"><bell-icon /></el-icon> -->
		</template>
	</k-table-column>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { baseProps, useBase } from '../base/base';

const emit = defineEmits(['allSelectionClicked', 'selectChange', 'update:selectAll']);
const props = defineProps({
	...baseProps,
	selectAll: Boolean,
	indeterminate: Boolean,
	width: { type: Number, default: 35 },
});
const propsRef = toRefs(props);
const baseInit = useBase(propsRef);

const selectAllModel = computed({
	get(): boolean {
		return propsRef.selectAll?.value;
	},
	set(val: boolean) {
		emit('update:selectAll', val);
	},
});

function clicked(event: Event) {
	event.stopPropagation();
}
</script>

<style lang="scss" scoped></style>
