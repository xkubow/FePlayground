<template>
	<slot :row="row" :columnId="columnId">
		{{ valueText }}
	</slot>
</template>

<script lang="ts">
export default {
	name: 'k-table-cell',
};
</script>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { Row } from './@types/table';

const props = defineProps({
	row: { type: Object as () => Row, required: true },
	columnId: { type: String, required: true },
	formatter: { type: Function as PropType<((row: Row, column: unknown, cellValue: unknown, index: number) => string) | undefined> },
});
const valueText = computed(() => {
	if (!props.row) return undefined;

	const val = props.row[props.columnId];
	if (props.formatter && val) {
		return val ? props.formatter(props.row, props.columnId, val, -1) : val;
	} else return val;
});
</script>

<style scoped></style>
