<template>
	<k-table-column v-bind="{ width }">
		<template #header>
			<el-checkbox v-model="seelctAllModel" :disabled="isDisabled" :indeterminate="indeterminate"></el-checkbox>
		</template>
		<template #default="scope">
			<el-checkbox
				:size="'small'"
				:disabled="isDisabled"
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

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { baseProps, useBase } from '../base/base';

export default defineComponent({
	name: 'k-table-column-select',
	props: {
		...baseProps,
		selectAll: Boolean,
		indeterminate: Boolean,
		width: { type: Number, default: 35 },
	},
	emits: ['allSelectionClicked', 'selectChange', 'update:selectAll'],
	setup(props, ctx) {
		const propsRef = toRefs(props);
		const baseInit = useBase(propsRef);

		const selectAllModel = computed({
			get(): boolean {
				return propsRef.selectAll?.value;
			},
			set(val: boolean) {
				ctx.emit('update:selectAll', val);
			},
		});

		function clicked(event: Event) {
			event.stopPropagation();
		}

		return { ...baseInit, seelctAllModel: selectAllModel, clicked };
	},
});
</script>

<style lang="scss" scoped></style>
