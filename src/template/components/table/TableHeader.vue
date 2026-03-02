<template>
	<k-button v-if="canCreate" :disabled="false" label-key="vytvorit" @click="$emit('createClick', $event)" />
	<k-button v-if="canExport" :disabled="false" label-key="export" @click="$emit('exportClick', $event)" />
</template>

<script setup lang="ts">
defineProps<{ canExport?: boolean; canCreate?: boolean }>();
defineEmits(['exportClick', 'createClick']);
</script>

<style scoped></style>
