<template>
	<el-form ref="elFormRef" :model="model" :rules="rules">
		<slot />
	</el-form>
</template>

<script lang="ts">
import type { FormInstance } from 'element-plus';
import { defineComponent, ref, toRefs } from 'vue';

export default defineComponent({
	name: 'k-form',
	props: {
		model: { type: Object, default: () => ({}) },
		rules: { type: Object, default: () => ({}) }
	},
	setup(_props, { expose }) {
		// Hold the real ElForm instance
		const elFormRef = ref<FormInstance | null>(null)
		const { model, rules } = toRefs(_props);

		// Expose a facade so parents can call these on <k-form ref="...">
		expose({
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

			// optional: raw instance if needed
			instance: elFormRef,
		})

		return { elFormRef, model, rules }
	},
});
</script>

<style scoped></style>
