<template>
	<el-footer>
		<slot />
	</el-footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'k-footer',
	setup() {
		return {};
	},
});
</script>

<style scoped></style>
