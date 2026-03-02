<template>
	<el-form ref="elFormRef" :model="model" :rules="rules">
		<slot />
	</el-form>
</template>


<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { ref, toRefs } from 'vue';

const props = defineProps({
	model: { type: Object, default: () => ({}) },
	rules: { type: Object, default: () => ({}) }
});
const elFormRef = ref<FormInstance | null>(null);
const { model, rules } = toRefs(props);

defineExpose({
	validate: async (...args: any[]) => {
		try {
			const t = await elFormRef.value?.validate?.();
			return t !== false;
		} catch {
			return false;
		}
	},
	validateField: (...args: any[]) => elFormRef.value?.validateField?.(...args),
	clearValidate: (...args: any[]) => elFormRef.value?.clearValidate?.(...args),
	resetFields: (...args: any[]) => elFormRef.value?.resetFields?.(...args),
	instance: elFormRef,
});
</script>

<style scoped></style>
