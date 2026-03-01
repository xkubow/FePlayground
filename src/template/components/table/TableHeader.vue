<template>
	<k-button v-if="canCreate" :disabled="false" label-key="vytvorit" @click="$emit('createClick', $event)" />
	<k-button v-if="canExport" :disabled="false" label-key="export" @click="$emit('exportClick', $event)" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'k-table-header',
	emits: ['exportClick', 'createClick'],
	props: {
		canExport: { type: Boolean },
		canCreate: { type: Boolean },
	},
});
</script>

<style scoped></style>
