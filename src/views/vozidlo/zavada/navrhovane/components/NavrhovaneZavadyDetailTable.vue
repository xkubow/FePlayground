<template>
	<div class="table-detail">
		<table v-if="rows?.length > 0" class="detail-table">
			<thead>
				<tr>
					<th style="width: 120px; text-align: right;">Pravděpodobnost</th>
					<th style="width: 140px;">Typ</th>
					<th style="width: 300px;">Popis</th>
					<th style="width: 100px; text-align: right;">Počet</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="detailRow in rows" :key="detailRow.rowNumber" :class="props.rowClassName({ row: detailRow, rowIndex: 0 })" @click="onRowClick(detailRow)">
					<td style="width: 40px; text-align: right;">{{ formatProbability(detailRow.probability) }}</td>
					<td style="width: 300px;">{{ detailRow.sqsZavadaTypText }}</td>
					<td style="width: 300px;">{{ detailRow.sqsZavadaVinikText }}</td>
					<td style="width: 100px; text-align: right;">{{ detailRow.pocetZavad }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
import type { NavrhovaneZavadyDetail } from '../tables/table';
import { columnsDetail } from '../tables/table';

export interface Props {
	rows: NavrhovaneZavadyDetail[];
	columns?: typeof columnsDetail;
	showHeader?: boolean;
	disabled?: boolean;
	selectable?: boolean;
	rowClassName?: (context: { row: NavrhovaneZavadyDetail; rowIndex: number }) => string;
}

const props = withDefaults(defineProps<Props>(), {
	columns: () => columnsDetail,
	showHeader: false,
	rowClassName: () => () => '',
});

const emit = defineEmits(['rowClick']);

function formatProbability(probability: number): string {
	if (!probability) return '0 %';
	const percent = Math.round(probability * 100 * 100) / 100;
	return `${percent} %`;
}

function onRowClick(detailRow: NavrhovaneZavadyDetail) {
	emit('rowClick', detailRow);
}
</script>

<style scoped>
.table-detail {
	padding: 0;
	margin: 0;
	width: 100%;
    padding: 0px 5%
}

.detail-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 12px;
	background-color: #fff;
	table-layout: fixed;
}

.detail-table thead {
	display: none;
	background-color: #f5f7fa;
	font-weight: 500;
}

.detail-table th {
	padding: 8px 12px !important;
	border: 1px solid #dcdfe6;
	text-align: left;
	font-weight: 500;
}

.detail-table td {
	border: 1px solid #dcdfe6;
	overflow: hidden;
	text-overflow: ellipsis;
    padding: 8px 8px !important;
    vertical-align: middle;
}

.detail-table tbody tr {
	cursor: pointer;
	transition: background-color 0.2s;
}

.detail-table tbody tr:hover {
	background-color: #f5f7fa;
}

.row-selected {
	background-color: #e6f7ff;
}
</style>
