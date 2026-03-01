<template>
	<k-table-column>
		<template #default="{ row }">
			<k-row class="jc-c ai-c">
				<k-col>
					<span v-if="!row.editPracoviste" class="pr-10">{{ row.cislo }}</span>
					<k-input v-else v-bind="{ labelKey: 'cislo', wrapp: false }" size="small" v-model.number="row.cislo" wrappClass="w-100" />
				</k-col>
			</k-row>
		</template>
	</k-table-column>
</template>

<script setup lang="ts"></script>

<style scoped></style>
