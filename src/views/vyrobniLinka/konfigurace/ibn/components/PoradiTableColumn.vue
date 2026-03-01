<template>
	<k-table-column class-name="p-0">
		<template #default="{ row }">
			<k-row class="jc-c ai-c">
				<k-col :span="22">
					<span v-if="!row.editIbn" class="pr-10">{{ row.poradi }}</span>
					<k-input v-else v-bind="{ labelKey: 'Poradi', wrapp: false }" size="small" v-model.number="row.poradi" wrappClass="w-100" />
				</k-col>
			</k-row>
		</template>
	</k-table-column>
</template>

<script setup lang="ts"></script>

<style scoped></style>
