<template>
	<el-form-item v-bind="{ ...$props, ...$attrs }">
		<slot />
	</el-form-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'k-form-item',
	setup() {
		return {};
	},
});
</script>

<style scoped></style>
