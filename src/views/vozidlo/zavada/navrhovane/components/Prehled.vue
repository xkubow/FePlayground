<template>
	<k-table ref="mainTable" v-bind="{ tableName: table.name, ...table, rows }" default-expand-all>
		<template #detail="{ column }">
			<k-table-column v-bind="{ column, type: 'expand', tableName: table.name, labelKey: column.i18nKey, align: 'center' }">
				<template #default="{ row }">
					<div class="table-detail-99">
						<k-table
							v-if="row.detail"
							v-bind="{
								tableName: table.name,
								columns: columnsDetail,
								rows: row.detail ?? [],
								rowKey: 'vozidloZavadaId',
								operations: 0,
								// showHeader: false,
								// disabled,
							}"
							default-expand-all
						>
							<template #detail="{ column2 }">
								<k-table-column v-bind="{ column2, type: 'expand', tableName: table.name, labelKey: column.i18nKey, align: 'center' }">
									<template #default="{ row: navrhyRows }">
										<div class="table-detail-99">
											<NavrhovaneZavadyVue v-if="navrhyRows.detail" v-bind="{ rows: navrhyRows.detail }" />
										</div>
									</template>
								</k-table-column>
							</template>
						</k-table>
					</div>
				</template>
			</k-table-column>
		</template>
	</k-table>
</template>

<script setup lang="ts">
import { columnsDetail, type NavrhovaneZavadyPrehled, table } from '../tables/prehled';
import NavrhovaneZavadyVue from './NavrhovaneZavady.vue';

export interface Props {
	disabled?: boolean;
	selectable?: boolean;
	rows: NavrhovaneZavadyPrehled[];
}

defineProps<Props>();
</script>

<style scoped></style>
