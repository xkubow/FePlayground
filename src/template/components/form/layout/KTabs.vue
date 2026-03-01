<template>
	<el-tabs :modelValue="value" @update:modelValue="$emit('update:modelValue', $event)">
		<slot />
	</el-tabs>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
	modelValue: string | null;
}

const props = defineProps<Props>();
defineEmits(['update:modelValue']);

const value = computed(() => props.modelValue ?? '');
</script>

<style scoped></style>
