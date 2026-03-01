<template>
	<k-table-column>
		<template #default="{ row }">
			<k-row class="jc-c ai-c">
				<k-col :span="22">
					<k-check-box v-bind="{ wrapp: false, showLabel: false }" :disabled="!row.editIbn" v-model="row.zobrazitNaSemaforu" wrappClass="w-100" />
				</k-col>
			</k-row>
		</template>
	</k-table-column>
</template>

<script setup lang="ts"></script>

<style scoped></style>
