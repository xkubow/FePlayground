<template>
	<k-container v-if="!leaving" class="full-content-height-container margin-content edit-container"
		direction="vertical">
		<k-header class="sub-page-header">
			<k-col>
				<k-row class="ai-c">
					<k-button data-testid="zavada-close" id="edit-layout-back-button" v-if="canClose" plain
						@click="$emit('closeClick', $event)" :disabled="false" :icon="CloseIcon" />
					<k-button v-if="canSave" :disabled="saveDisabled" plain type="success"
						@click="$emit('saveClick', $event)" :icon="CheckIcon" />
					<k-button v-if="canDelete" plain @click="$emit('deleteClick', $event)" :icon="DeleteIcon" />
					<k-divider v-if="$slots.actions" direction="vertical" style="height: 2em" />
					<span class="ml-10 df title sub-title">
						<slot name="title" />
					</span>
					<div v-if="$slots.actions" class="ml-a">
						<slot name="actions" />
					</div>
				</k-row>
			</k-col>
		</k-header>
		<k-main>
			<k-form v-bind="{ model, rules }" label-position="top" ref="kFormRef">
				<slot />
			</k-form>
		</k-main>
	</k-container>
</template>
<script lang="ts">
export default {
	name: 'k-layout-edit',
};
</script>
<script setup lang="ts">
import { Check as CheckIcon, Close as CloseIcon, Delete as DeleteIcon } from '@element-plus/icons-vue';
import type { UnknownObject } from '../@types/kTemplate';
import { ref } from 'vue';
import type { FormInstance } from 'element-plus';

export interface Props {
	canClose?: boolean; //{ type: Boolean, default: true },
	canSave?: boolean; //{ type: Boolean, default: true },
	canDelete?: boolean; //{ type: Boolean, default: true },
	model?: object; //{ type: Object, default: () => ({}) },
	rules?: UnknownObject; //{ type: Object, default: () => ({}) },
	leaving?: boolean; //{ type: Boolean },
	saveDisabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
	canClose: true,
	canSave: true,
	canDelete: true,
	model: () => ({}),
	rules: () => ({}),
	leaving: false,
});

const kFormRef = ref<{
	validate: FormInstance['validate']
	validateField: FormInstance['validateField']
	clearValidate: FormInstance['clearValidate']
	resetFields: FormInstance['resetFields']
} | null>(null)

// expose a small facade so parents can call layoutRef.validate()
defineExpose({
	async validate(...args: any[]) {
		console.log('layout model:', props.model);
		return await kFormRef.value?.validate?.(...args)
	},
	async validateField(...args: any[]) {
		// validateField rejects on error in Element Plus
		return await kFormRef.value?.validateField?.(...args)
	},
	clearValidate(...args: any[]) {
		return kFormRef.value?.clearValidate?.(...args)
	},
	resetFields(...args: any[]) {
		return kFormRef.value?.resetFields?.(...args)
	},
	// optional getter in case you want direct access
	getForm() {
		return kFormRef.value
	}
})
</script>

<style scoped></style>
